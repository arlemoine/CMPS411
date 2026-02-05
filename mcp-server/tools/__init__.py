"""
MCP Tools Module

This folder contains individual MCP tool implementations.

Each tool should be in its own subfolder with:
- __init__.py: Tool package marker
- tool.py: FastAPI router with tool endpoints
- meta.yaml: Tool metadata for LLM Orchestrator

Example tools to implement:
- ehr_patients/: Patient search and demographics
- icd10_lookup/: Diagnosis code lookup
- patient_medications/: Medication history
- patient_labs/: Lab results
- patient_encounters/: Visit history

TODO: Implement tools as needed for your use cases
"""