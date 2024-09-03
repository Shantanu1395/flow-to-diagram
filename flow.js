class Flow {
    constructor(name) {
        this.name = name;
        this.flows = [];
    }

    addFlow(flow) {
        this.flows.push(flow);
    }

    static parseFlowStructure(input) {
    let index = 0;

    function parse() {
        // Skip over any leading whitespace or separators
        while (index < input.length && (input[index] === ' ' || input[index] === ',' || input[index] === '>')) {
            index++;
        }

        if (input.slice(index, index + 4) !== 'Flow') {
            return null; // No more flows to parse
        }

        // Extract Flow name
        index = input.indexOf('{', index) + 1;
        let nameStart = input.indexOf('"', index) + 1;
        let nameEnd = input.indexOf('"', nameStart);
        let flowName = input.slice(nameStart, nameEnd);
        let newFlow = new Flow(flowName);

        // Move index to start parsing subflows
        index = nameEnd + 1;

        // Parse Flows
        if (input[index] === ',' && input.slice(index + 1, index + 7) === ' Flows') {
            index = input.indexOf('<', index) + 1; // Move past "Flows: <"
            while (input[index] !== '>') {
                let subFlow = parse();
                if (subFlow) {
                    newFlow.addFlow(subFlow);
                }
                // Ensure the index moves forward to prevent an infinite loop
                while (index < input.length && input[index] !== 'F' && input[index] !== '>') {
                    index++;
                }
            }
            index++; // Move past '>'
        }
        return newFlow;
    }

    return parse();
}

    toString(level = 0) {
        let indent = '  '.repeat(level);
        let result = `${indent}Flow(Name: ${this.name})\n`;
        this.flows.forEach(flow => {
            result += flow.toString(level + 1);
        });
        return result;
    }
}

// Example input

// Parse and log the flow object
// let inputText = 'Flow {Name: "Code to Cluster Deployment", Flows: <\n  Flow {Name: "Code Commit", Flows: <>},\n  Flow {Name: "Pipeline Trigger", Flows: <>},\n  Flow {Name: "Charts Repo", Flows: <\n    Flow {Name: "key.yaml", Flows: <\n      Flow {Name: "service names", Flows: <\n        Flow {Name: "service1: cs-pro-api-trading", Flows: <>},\n        Flow {Name: "service2: cs-pro-api-analytics", Flows: <>}\n      >}\n    >},\n    Flow {Name: "value.yaml", Flows: <\n      Flow {Name: "Networking and Access", Flows: <\n        Flow {Name: "Service Exposure", Flows: <\n          Flow {Name: "Service", Flows: <\n            Flow {Name: "cs-pro-api-trading", Flows: <\n              Flow {Name: "targetPort: 3000", Flows: <>}\n            >}\n          >},\n          Flow {Name: "Service Internal", Flows: <\n            Flow {Name: "cs-pro-api-trading", Flows: <\n              Flow {Name: "targetPort: 3000", Flows: <>}\n            >}\n          >}\n        >},\n        Flow {Name: "Ingress Management", Flows: <\n          Flow {Name: "Ingress", Flows: <\n            Flow {Name: "cs-pro-api-trading.coinswitch.co", Flows: <\n              Flow {Name: "path: /", Flows: <>},\n              Flow {Name: "scheme: internet-facing", Flows: <>}\n            >}\n          >},\n          Flow {Name: "Ingress Canary Internal", Flows: <\n            Flow {Name: "cs-pro-api-trading.internal-uat.coinswitch.co", Flows: <\n              Flow {Name: "path: /", Flows: <>},\n              Flow {Name: "scheme: internal", Flows: <>}\n            >}\n          >}\n        >}\n      >},\n      Flow {Name: "Initialization and Configuration", Flows: <\n        Flow {Name: "Initialization", Flows: <\n          Flow {Name: "Enabled: true", Flows: <>},\n          Flow {Name: "Service Name: cs-pro-api-trading", Flows: <>}\n        >},\n        Flow {Name: "Environment Setup", Flows: <\n          Flow {Name: "Environment Variables", Flows: <\n            Flow {Name: "HOST_TYPE: uat", Flows: <>},\n            Flow {Name: "PORT: 3000", Flows: <>}\n          >}\n        >}\n      >},\n      Flow {Name: "Deployment Strategy", Flows: <\n        Flow {Name: "Deployment Strategy", Flows: <\n          Flow {Name: "Deployment", Flows: <\n            Flow {Name: "replicaCount: 1", Flows: <>},\n            Flow {Name: "repository: cs-pro-api-trading-uat", Flows: <>},\n            Flow {Name: "tag: latest", Flows: <>}\n          >}\n        >},\n        Flow {Name: "Rollout Management", Flows: <\n          Flow {Name: "Rollout", Flows: <\n            Flow {Name: "canary", Flows: <\n              Flow {Name: "enabled: true", Flows: <>},\n              Flow {Name: "scaleDownDelaySeconds: 2", Flows: <>},\n              Flow {Name: "steps", Flows: <\n                Flow {Name: "setCanaryScale: weight: 20", Flows: <>},\n                Flow {Name: "setWeight: 0", Flows: <>}\n              >}\n            >}\n          >}\n        >}\n      >},\n      Flow {Name: "Resource and Node Management", Flows: <\n        Flow {Name: "Resource Allocation", Flows: <\n          Flow {Name: "Resources", Flows: <\n            Flow {Name: "limits", Flows: <\n              Flow {Name: "cpu: 100m", Flows: <>},\n              Flow {Name: "memory: 300Mi", Flows: <>}\n            >},\n            Flow {Name: "requests", Flows: <\n              Flow {Name: "cpu: 50m", Flows: <>},\n              Flow {Name: "memory: 200Mi", Flows: <>}\n            >}\n          >},\n          Flow {Name: "Autoscaling", Flows: <\n            Flow {Name: "enabled: false", Flows: <>},\n            Flow {Name: "minReplicas: 2", Flows: <>},\n            Flow {Name: "maxReplicas: 2", Flows: <>},\n            Flow {Name: "targetCPUUtilizationPercentage: 80", Flows: <>}\n          >}\n        >},\n        Flow {Name: "Node Scheduling", Flows: <\n          Flow {Name: "Taint", Flows: <\n            Flow {Name: "enabled: true", Flows: <>},\n            Flow {Name: "nodeSelector: test", Flows: <>},\n            Flow {Name: "tolerations", Flows: <\n              Flow {Name: "key: node", Flows: <>},\n              Flow {Name: "operator: Equal", Flows: <>},\n              Flow {Name: "value: test", Flows: <>},\n              Flow {Name: "effect: NoSchedule", Flows: <>}\n            >}\n          >}\n        >}\n      >},\n      Flow {Name: "Monitoring and Observability", Flows: <\n        Flow {Name: "Monitoring Setup", Flows: <\n          Flow {Name: "Service Monitor", Flows: <\n            Flow {Name: "enabled: false", Flows: <>},\n            Flow {Name: "path: /api-trading-service/api/v1/metrics", Flows: <>},\n            Flow {Name: "port: 3000", Flows: <>}\n          >}\n        >}\n      >}\n    >},\n    Flow {Name: "template.yaml", Flows: <\n      Flow {Name: "description: Contains Kubernetes template configurations for deployments", Flows: <>}\n    >}\n  >}\n>}'
// let flowObject = Flow.parseFlowStructure(inputText);
// console.log(flowObject.toString());
