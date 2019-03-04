ARG VERSION=v0.24.0
FROM gcr.io/k8s-skaffold/skaffold:${VERSION}
COPY --from=golang:1.12 /usr/local/go /usr/local/go
ENV PATH /usr/local/go/bin:/go/bin:$PATH
ENV GOPATH /go/
