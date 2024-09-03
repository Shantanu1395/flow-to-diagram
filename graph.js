// Convert the Flow object to D3-friendly format
function convertToD3Format(flow) {
    return {
        name: flow.name,
        children: flow.flows.map(convertToD3Format)
    };
}

// Sample input
let inputText = `Flow {Name: "Code to Cluster Deployment", Flows: <
  Flow {Name: "Code Commit", Flows: <>},
  Flow {Name: "Pipeline Trigger", Flows: <>},
  Flow {Name: "Charts Repo", Flows: <
    Flow {Name: "key.yaml", Flows: <
      Flow {Name: "service names", Flows: <
        Flow {Name: "service1: cs-pro-api-trading", Flows: <>},
        Flow {Name: "service2: cs-pro-api-analytics", Flows: <>}
      >}
    >},
    Flow {Name: "value.yaml", Flows: <
      Flow {Name: "Networking and Access", Flows: <
        Flow {Name: "Service Exposure", Flows: <
          Flow {Name: "Service", Flows: <
            Flow {Name: "cs-pro-api-trading", Flows: <
              Flow {Name: "targetPort: 3000", Flows: <>}
            >}
          >},
          Flow {Name: "Service Internal", Flows: <
            Flow {Name: "cs-pro-api-trading", Flows: <
              Flow {Name: "targetPort: 3000", Flows: <>}
            >}
          >}
        >},
        Flow {Name: "Ingress Management", Flows: <
          Flow {Name: "Ingress", Flows: <
            Flow {Name: "cs-pro-api-trading.coinswitch.co", Flows: <
              Flow {Name: "path: /", Flows: <>},
              Flow {Name: "scheme: internet-facing", Flows: <>}
            >}
          >},
          Flow {Name: "Ingress Canary Internal", Flows: <
            Flow {Name: "cs-pro-api-trading.internal-uat.coinswitch.co", Flows: <
              Flow {Name: "path: /", Flows: <>},
              Flow {Name: "scheme: internal", Flows: <>}
            >}
          >}
        >}
      >},
      Flow {Name: "Initialization and Configuration", Flows: <
        Flow {Name: "Initialization", Flows: <
          Flow {Name: "Enabled: true", Flows: <>},
          Flow {Name: "Service Name: cs-pro-api-trading", Flows: <>}
        >},
        Flow {Name: "Environment Setup", Flows: <
          Flow {Name: "Environment Variables", Flows: <
            Flow {Name: "HOST_TYPE: uat", Flows: <>},
            Flow {Name: "PORT: 3000", Flows: <>}
          >}
        >}
      >},
      Flow {Name: "Deployment Strategy", Flows: <
        Flow {Name: "Deployment Strategy", Flows: <
          Flow {Name: "Deployment", Flows: <
            Flow {Name: "replicaCount: 1", Flows: <>},
            Flow {Name: "repository: cs-pro-api-trading-uat", Flows: <>},
            Flow {Name: "tag: latest", Flows: <>}
          >}
        >},
        Flow {Name: "Rollout Management", Flows: <
          Flow {Name: "Rollout", Flows: <
            Flow {Name: "canary", Flows: <
              Flow {Name: "enabled: true", Flows: <>},
              Flow {Name: "scaleDownDelaySeconds: 2", Flows: <>},
              Flow {Name: "steps", Flows: <
                Flow {Name: "setCanaryScale: weight: 20", Flows: <>},
                Flow {Name: "setWeight: 0", Flows: <>}
              >}
            >}
          >}
        >}
      >},
      Flow {Name: "Resource and Node Management", Flows: <
        Flow {Name: "Resource Allocation", Flows: <
          Flow {Name: "Resources", Flows: <
            Flow {Name: "limits", Flows: <
              Flow {Name: "cpu: 100m", Flows: <>},
              Flow {Name: "memory: 300Mi", Flows: <>}
            >},
            Flow {Name: "requests", Flows: <
              Flow {Name: "cpu: 50m", Flows: <>},
              Flow {Name: "memory: 200Mi", Flows: <>}
            >}
          >},
          Flow {Name: "Autoscaling", Flows: <
            Flow {Name: "enabled: false", Flows: <>},
            Flow {Name: "minReplicas: 2", Flows: <>},
            Flow {Name: "maxReplicas: 2", Flows: <>},
            Flow {Name: "targetCPUUtilizationPercentage: 80", Flows: <>}
          >}
        >},
        Flow {Name: "Node Scheduling", Flows: <
          Flow {Name: "Taint", Flows: <
            Flow {Name: "enabled: true", Flows: <>},
            Flow {Name: "nodeSelector: test", Flows: <>},
            Flow {Name: "tolerations", Flows: <
              Flow {Name: "key: node", Flows: <>},
              Flow {Name: "operator: Equal", Flows: <>},
              Flow {Name: "value: test", Flows: <>},
              Flow {Name: "effect: NoSchedule", Flows: <>}
            >}
          >}
        >}
      >},
      Flow {Name: "Monitoring and Observability", Flows: <
        Flow {Name: "Monitoring Setup", Flows: <
          Flow {Name: "Service Monitor", Flows: <
            Flow {Name: "enabled: false", Flows: <>},
            Flow {Name: "path: /api-trading-service/api/v1/metrics", Flows: <>},
            Flow {Name: "port: 3000", Flows: <>}
          >}
        >}
      >}
    >},
    Flow {Name: "template.yaml", Flows: <
      Flow {Name: "description: Contains Kubernetes template configurations for deployments", Flows: <>}
    >}
  >}
>}
`;

let flowObject = Flow.parseFlowStructure(inputText);
let d3Data = convertToD3Format(flowObject);

let i = 0; // Initialize i to be used for node IDs

// D3 visualization setup
const width = 1200;
const height = 800;

const svg = d3.select("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .call(d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
    }));

const g = svg.append("g").attr("transform", `translate(${width / 4}, 20)`);  // Adjusted for horizontal layout

const tree = d3.tree().nodeSize([150, 80]);  // Adjusted node size to flip x and y
const root = d3.hierarchy(d3Data);
root.x0 = 0;
root.y0 = width / 2;

// Collapse all nodes initially
root.descendants().forEach(d => {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    }
});

// Calculate weight of nodes as number of descendants
root.descendants().forEach(d => {
    d.weight = d.descendants().length;
});

// Define color scale based on weight
const maxWeight = d3.max(root.descendants(), d => d.weight);
const colorScale = d3.scaleLinear()
    .domain([0, maxWeight])
    .range(["#d3d3d3", "#2c3e50"])  // Light to dark based on weight
    .interpolate(d3.interpolateLab);

function click(event, d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        if (d._children) {
            d.children = d._children;
            d._children = null;
            d.children.forEach(child => {
                if (!child._children && child.children) {
                    child._children = child.children;
                    child.children = null;
                }
            });
        }
    }
    update(d);
}

function getColor(d) {
    return colorScale(d.weight); // Get color based on node weight
}

function update(source) {
    const treeData = tree(root);
    const nodes = treeData.descendants();
    const links = treeData.links();

    const node = g.selectAll('g.node')
        .data(nodes, d => d.id || (d.id = ++i));

    const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", d => `translate(${source.x0},${source.y0})`)
        .on('click', click);

    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .style("fill", d => getColor(d)) // Apply color based on weight
        .style("stroke", "black") // Optional: add stroke for better visibility
        .style("stroke-width", 1.5);

    nodeEnter.append('text')
        .attr("dy", "-1.5em")  // Position text above the node
        .attr("x", 0)          // Center text horizontally above the node
        .attr("text-anchor", "middle") // Center the text
        .text(d => d.data.name);

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
        .duration(200)
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", d => getColor(d))
        .attr('cursor', 'pointer');

    const nodeExit = node.exit().transition()
        .duration(200)
        .attr("transform", d => `translate(${source.x0},${source.y0})`)
        .remove();

    nodeExit.select('circle')
        .attr('r', 1e-6);

    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    const link = g.selectAll('path.link')
        .data(links, d => d.target.id);

    const linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal(o, o);
        });

    const linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(200)
        .attr('d', d => diagonal(d.source, d.target));

    const linkExit = link.exit().transition()
        .duration(200)
        .attr('d', d => {
            const o = {x: source.x, y: source.y};
            return diagonal(o, o);
        })
        .remove();

    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    function diagonal(s, d) {
        return `M ${s.x} ${s.y}
                C ${s.x} ${(s.y + d.y) / 2},
                  ${d.x} ${(s.y + d.y) / 2},
                  ${d.x} ${d.y}`;
    }
}

update(root);
