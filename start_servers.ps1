Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "uvicorn", "services.catalog.main:app", "--port", "8000"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "uvicorn", "services.firewall.main:app", "--port", "8001"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "uvicorn", "services.audit.main:app", "--port", "8002"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "uvicorn", "services.payments.main:app", "--port", "8003"
