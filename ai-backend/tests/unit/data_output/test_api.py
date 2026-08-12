def test_health_check_endpoint(client):
    response = client.get("/api/v1/data-output/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["module"] == "Module 3 - Data & Output"
