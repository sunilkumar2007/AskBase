import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  PlusCircle,
  Search as SearchIcon,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Database,
  ArrowRight,
  Zap,
  Star,
  Command as CommandIcon
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="SEARCH CHATS, PROJECTS, OR DATA..." className="text-[10px] font-black uppercase tracking-widest" />
        <CommandList className="max-h-[450px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Intelligence">
            <CommandItem onSelect={() => runCommand(() => navigate({ to: '/app/chat' }))}>
              <PlusCircle className="mr-3 h-4 w-4" />
              <span>New Analysis</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: '/app/dashboard' }))}>
              <LayoutDashboard className="mr-3 h-4 w-4" />
              <span>Intelligence Dashboard</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: '/app/projects' }))}>
              <Database className="mr-3 h-4 w-4" />
              <span>Project Workspaces</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Reports & Artifacts">
            <CommandItem onSelect={() => runCommand(() => toast.info("Searching reports..."))}>
              <FileText className="mr-3 h-4 w-4" />
              <span>Recent Reports</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => toast.info("Opening favorites..."))}>
              <Star className="mr-3 h-4 w-4" />
              <span>Favorite Insights</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="System">
            <CommandItem onSelect={() => runCommand(() => navigate({ to: '/app/profile' }))}>
              <User className="mr-3 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘U</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: '/app/settings' }))}>
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="AskBase @Commands">
            <CommandItem onSelect={() => runCommand(() => toast.info("Switched to @chart mode"))}>
              <Zap className="mr-3 h-4 w-4 text-[#CB2958]" />
              <span>@chart</span>
              <span className="ml-2 text-[9px] text-[#A1A1AA] uppercase font-black">Generate Visualization</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => toast.info("Switched to @sql mode"))}>
              <Zap className="mr-3 h-4 w-4 text-[#CB2958]" />
              <span>@sql</span>
              <span className="ml-2 text-[9px] text-[#A1A1AA] uppercase font-black">View Query Logic</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => toast.info("Switched to @diagram mode"))}>
              <Zap className="mr-3 h-4 w-4 text-[#CB2958]" />
              <span>@diagram</span>
              <span className="ml-2 text-[9px] text-[#A1A1AA] uppercase font-black">System Architecture</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
