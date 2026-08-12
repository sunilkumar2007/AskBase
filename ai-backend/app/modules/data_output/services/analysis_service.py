from typing import List, Dict, Any
try:
    import pandas as pd
except ImportError:
    pd = None


class AnalysisService:
    """Pandas data analysis service for computing column statistics and profiles."""

    @staticmethod
    def profile_dataset(columns: List[str], rows: List[List[Any]]) -> Dict[str, Any]:
        """Compute column profiling data, null counts, distinct counts, and numeric stats."""
        if pd is not None:
            df = pd.DataFrame(rows, columns=columns)
            profile = {
                "total_rows": len(df),
                "total_columns": len(columns),
                "column_stats": {},
            }
            
            for col in columns:
                series = df[col]
                stats = {
                    "data_type": str(series.dtype),
                    "null_count": int(series.isnull().sum()),
                    "distinct_count": int(series.nunique()),
                }
                if pd.api.types.is_numeric_dtype(series):
                    stats.update(
                        {
                            "min": float(series.min()) if not series.empty else None,
                            "max": float(series.max()) if not series.empty else None,
                            "mean": float(series.mean()) if not series.empty else None,
                            "std": float(series.std()) if len(series) > 1 else 0.0,
                        }
                    )
                profile["column_stats"][col] = stats
            return profile

        # Fallback dictionary stats profiling if pandas is not installed
        profile = {
            "total_rows": len(rows),
            "total_columns": len(columns),
            "column_stats": {},
        }
        for idx, col in enumerate(columns):
            col_vals = [r[idx] for r in rows if idx < len(r)]
            null_cnt = sum(1 for v in col_vals if v is None)
            distinct_cnt = len(set(str(v) for v in col_vals if v is None))
            profile["column_stats"][col] = {
                "data_type": "string",
                "null_count": null_cnt,
                "distinct_count": distinct_cnt,
            }
        return profile
