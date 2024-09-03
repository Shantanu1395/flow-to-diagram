class Flow {
    constructor(name) {
        this.name = name;
        this.flows = [];
    }

    addFlow(flow) {
        this.flows.push(flow);
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

function parseFlowStructure(input) {
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

// Example input

// Parse and log the flow object
// let flowObject = parseFlowStructure(inputText);
// console.log(flowObject.toString());
