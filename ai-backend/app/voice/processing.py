"""AskBase AI Backend - Transcript cleaning and normalization.

Fixes common voice transcription artifacts WITHOUT changing user meaning.
"""
from __future__ import annotations

import logging
import re
from typing import Any

from app.voice.config import VoiceSettings


logger = logging.getLogger("askbase")

_FILLER_WORDS = {
	"uh", "um", "eh", "ah", "er", "hmm", "hm", "huh",
	"like", "you know", "i mean", "so yeah", "well yeah",
	"basically", "literally", "really", "honestly",
}
_REPEATABLE_FILLERS = {"okay", "ok", "right", "yeah", "yes", "no"}

_COMMAND_PATTERNS: dict[str, list[re.Pattern]] = {
	"SHOW_SQL": [re.compile(r"\b(show|display|view|see)\b.*\b(sql|query)\b", re.I)],
	"EXPORT_PDF": [re.compile(r"\b(export|save|download)\b.*\bpdf\b", re.I)],
	"EXPORT_CSV": [re.compile(r"\b(export|save|download)\b.*\b(csv|excel)\b", re.I)],
	"CREATE_REPORT": [re.compile(r"\b(create|generate|make)\b.*\b(report)\b", re.I)],
	"CREATE_DASHBOARD": [re.compile(r"\b(create|build)\b.*\b(dashboard)\b", re.I)],
	"CREATE_POWERPOINT": [re.compile(r"\b(create|make)\b.*\b(powerpoint|ppt)\b", re.I)],
	"EXPLAIN": [re.compile(r"\b(explain|why|describe)\b", re.I)],
	"FILTER": [re.compile(r"\b(filter|only|just|limit to)\b", re.I)],
	"COMPARE": [re.compile(r"\b(compare|versus|vs|against)\b", re.I)],
	"CHART_BAR": [re.compile(r"\bbar chart\b", re.I)],
	"CHART_LINE": [re.compile(r"\b(line chart|trend)\b", re.I)],
	"CHART_PIE": [re.compile(r"\bpie chart\b", re.I)],
	"CHART_SCATTER": [re.compile(r"\bscatter\b", re.I)],
	"CANCEL": [re.compile(r"\b(stop|cancel|never ?mind|abort)\b", re.I)],
	"CLEAR": [re.compile(r"\b(clear|reset|start over|new chat)\b", re.I)],
	"REPEAT": [re.compile(r"\b(repeat|again|run that)\b", re.I)],
}

_SIMPLE_NUMBERS = {
	"zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
	"five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
	"ten": "10", "eleven": "11", "twelve": "12", "thirteen": "13",
	"fourteen": "14", "fifteen": "15", "sixteen": "16", "seventeen": "17",
	"eighteen": "18", "nineteen": "19", "twenty": "20", "thirty": "30",
	"forty": "40", "fifty": "50", "sixty": "60", "seventy": "70",
	"eighty": "80", "ninety": "90",
	"hundred": "100", "thousand": "1000", "million": "1000000", "billion": "1000000000",
}
_TENS_MULTIPLIERS = {
	"twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
	"sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90,
}


def remove_fillers(text: str) -> str:
	words = text.split()
	result = []
	i = 0
	while i < len(words):
		w = words[i].lower().strip(",.!?")
		skip = False
		if i + 1 < len(words):
			two = f"{w} {words[i+1].lower().strip(',.!?')}"
			if two in _FILLER_WORDS:
				i += 2
				continue
		if w in _FILLER_WORDS and w not in ("right", "yes", "no"):
			i += 1
			continue
		result.append(words[i])
		i += 1
	return " ".join(result)


def remove_repeated_phrases(text: str) -> str:
	text = re.sub(r"\b(\w+)\s+\1\b", r"\1", text, flags=re.IGNORECASE)
	text = re.sub(r"\b(\w+\s+\w+)\s+\1\b", r"\1", text, flags=re.IGNORECASE)
	return text


def normalize_number_words(text: str) -> str:
	words = text.split()
	tokens = []
	i = 0
	while i < len(words):
		w = words[i].lower().strip(",.!?")
		if w in _TENS_MULTIPLIERS and i + 1 < len(words):
			next_w = words[i + 1].lower().strip(",.!?")
			if next_w in _SIMPLE_NUMBERS and int(_SIMPLE_NUMBERS[next_w]) < 10:
				val = _TENS_MULTIPLIERS[w] + int(_SIMPLE_NUMBERS[next_w])
				tokens.append((str(val), True))
				i += 2
				continue
		if w in _SIMPLE_NUMBERS:
			val = _SIMPLE_NUMBERS[w]
			if i + 1 < len(words):
				next_w = words[i + 1].lower().strip(",.!?")
				if next_w in ("thousand", "million", "billion"):
					mult = {"thousand": 1000, "million": 1000000, "billion": 1000000000}
					tokens.append((str(int(val) * mult[next_w]), True))
					i += 2
					continue
			tokens.append((val, True))
			i += 1
			continue
		tokens.append((words[i], False))
		i += 1

	merged: list[tuple[str, bool]] = []
	for tok, is_num in tokens:
		if is_num and merged and merged[-1][1]:
			try:
				prev_val = int(merged[-1][0])
				curr_val = int(tok)
				if prev_val % 1000 == 0 and curr_val < 1000:
					merged[-1] = (str(prev_val + curr_val), True)
					continue
			except ValueError:
				pass
		merged.append((tok, is_num))

	return " ".join(t[0] for t in merged)



def fix_punctuation(text: str) -> str:
	text = re.sub(r'([.!?])\s+([a-z])', lambda m: m.group(1) + " " + m.group(2).upper(), text)
	text = text.strip()
	if text:
		text = text[0].upper() + text[1:]
	text = re.sub(r'([.!?,;:])\1+', r"\1", text)
	text = re.sub(r'\s+([.,!?;:])', r"\1", text)
	text = re.sub(r'([.,!?;:])([A-Za-z])', r"\1 \2", text)
	return text


def detect_intent(text: str) -> dict[str, Any]:
	detected = []
	for intent, patterns in _COMMAND_PATTERNS.items():
		for pat in patterns:
			if pat.search(text):
				detected.append(intent)
				break
	if not detected:
		detected.append("QUERY_DATA")
	chart_types = [i for i in detected if i.startswith("CHART_")]
	if len(chart_types) > 1:
		detected = [i for i in detected if not i.startswith("CHART_")] + [chart_types[0]]
	return {
		"primary_intent": detected[0],
		"all_intents": detected,
		"confidence": 1.0,
	}


def is_cancel_command(text: str) -> bool:
	clean = text.lower().strip()
	return bool(re.fullmatch(r"\b(stop|cancel|never ?mind|forget it|abort|quit)\b", clean))


def is_confirmation(text: str) -> bool | None:
	clean = text.lower().strip()
	if re.fullmatch(r"\b(yes|yeah|yep|sure|continue|proceed|do it|go ahead)\b", clean):
		return True
	if re.fullmatch(r"\b(no|nope|nah|don'?t|cancel|stop)\b", clean):
		return False
	return None


def process_transcript(raw_transcript: str, language: str = "en") -> dict:
	cfg = VoiceSettings()
	original = raw_transcript.strip()
	text = original

	text = remove_repeated_phrases(text)
	text = remove_fillers(text)
	if cfg.enable_number_normalization:
		text = normalize_number_words(text)
	text = fix_punctuation(text)
	text = re.sub(r"\s+", " ", text).strip()

	intent = detect_intent(text)
	is_cancel = is_cancel_command(text)

	needs_clarification = False
	clarification_reason = None
	number_words = re.findall(
		r"\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(one|two|three|four|five|six|seven|eight|nine)\b",
		text, re.I
	)
	if number_words:
		needs_clarification = True
		clarification_reason = f"Unclear number: '{number_words[0][0]} {number_words[0][1]}'"

	return {
		"original": original,
		"normalized": text,
		"language": language,
		"intent": intent,
		"is_cancel": is_cancel,
		"needs_clarification": needs_clarification,
		"clarification_reason": clarification_reason,
	}
