# Spotguide for Node.js with MongoDB database

This spotguide includes a boilerplate service, already prepared to run in Kubernetes:

* builds on Node.js best practices
* specifically prepared for containerised environment
* graceful shutdown => no service downtime during deployment rolling update
* graceful error handling => gracefully shutdown application when an unexpected/unhandled error happens
* structured JSON logging
* health-check endpoints for liveness and readiness probes
* easily modifiable, tested REST API endpoints
* exposed Prometheus metrics and Grafana dashboard for monitoring
* TLS endpoint
* horizontally scalable service architecture, autoscaling deployment based on load
* configured CI/CD pipeline for continuous integration and deployment
* easy local development (with [skaffold](https://github.com/GoogleContainerTools/skaffold) or [docker-compose](https://docs.docker.com/compose/) and local Node.js) and customization
* documentations
