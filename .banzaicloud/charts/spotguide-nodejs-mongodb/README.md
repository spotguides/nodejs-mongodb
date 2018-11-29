# Node.js with MongoDB

## TL;DR;

```sh
helm install .
```

## Introduction

This chart bootstraps an (Node.js) application with MongoDB deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Prerequisites

- Kubernetes 1.10+
- PV provisioner support in the underlying infrastructure

## Installing the Chart

To install the chart with the release name `my-release`:

```sh
helm install --name my-release .
```

The command deploys the application and MongoDB on the Kubernetes cluster in the default configuration. The configuration section lists the parameters that can be configured during installation.

> Tip: List all releases using `helm list`

## Configuration

The configurable parameters and default values are listed in [`values.yaml`](values.yaml).

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`.

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```sh
helm install --name my-release -f my-values.yaml .
```
