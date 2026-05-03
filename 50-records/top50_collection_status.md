# Top 50 UK Universities Scholarship Collection Status

Source ranking: Complete University Guide 2026 (overall table)
Source URL: https://www.thecompleteuniversityguide.co.uk/league-tables/rankings

## Current progress
- Completed: 1 of 50 (University of Manchester)
- Remaining: 49 of 50

## Data files
- Existing full dataset (currently Manchester only): university_of_manchester_scholarships_2026_27.json
- Top 50 target list: top50_uk_universities_2026.csv

## Next execution plan
1. For each university in top50_uk_universities_2026.csv, collect scholarships pages (official university domains first).
2. Extract prerequisites using same schema used for Manchester JSON.
3. Save one per-university JSON in a folder named universities_json.
4. Merge per-university JSON files into a combined top50_scholarships_2026_27.json.
5. Export combined CSV and HTML reports.
