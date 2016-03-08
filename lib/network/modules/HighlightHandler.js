import Node from './components/Node';

let util = require('../../util');

class HighlightHandler {
    constructor(body, canvas) {
        this.body = body;
        this.canvas = canvas;
        this.highlightedNodes = [];

        this.body.emitter.on("_dataChanged", () => {
            this.updateHighlightedNodes();
        });
    }

    highlightObject(obj) {
        if (obj !== undefined) {
            obj.highlightOn();
            this._addToHighlightedNodes(obj);
            return true;
        }
        return false;
    }

    turnHighlightOffForObject(obj) {
        if (obj.isHighlighted() === true) {
            obj.highlight = false;
            this._removeFromHighlightedNodes(obj);
        }
    }

    /**
     * Add object to the highlighted nodes array.
     *
     * @param obj
     * @private
     */
    _addToHighlightedNodes(obj) {
        if (obj instanceof Node) {
            this.highlightedNodes[obj.id] = obj;
        }
    }

    /**
     * Remove a single option from highlighted nodes array.
     *
     * @param {Object} obj
     * @private
     */
    _removeFromHighlightedNodes(obj) {
        if (obj instanceof Node) {
            delete this.highlightedNodes[obj.id];
        }
    }

    /**
     * Turns off the highlight for all of the nodes
     */
    turnOffAllHighlights() {
        for(let nodeId in this.highlightedNodes) {
            if(this.highlightedNodes.hasOwnProperty(nodeId)) {
                this.highlightedNodes[nodeId].highlightOff();
            }
        }

        this.highlightedNodes = {};
    }


    /**
     * return the number of highlighted nodes
     *
     * @returns {number}
     * @private
     */
    _getHighlightedNodeCount() {
        return this.highlightedNodes.length;
    }

    /**
     *
     * retrieve the currently highlighted nodes
     * @return {String[]} An array with the ids of the
     *                    highlighted nodes.
     */
    getHighlightedNodes() {
        let idArray = [];

        for (let nodeId in this.highlightedNodes) {
            if (this.highlightedNodes.hasOwnProperty(nodeId)) {
                idArray.push(this.highlightedNodes[nodeId].id);
            }
        }

        return idArray;
    }

    /**
     * Highlights the specified nodes
     * @param {Number[] | String[]} nodeIds An array with the ids of the
     *                                      nodes to be highlighted.
     */
    highlightNodes(nodeIds) {

        if (!nodeIds || (nodeIds.length === undefined))
            throw 'nodeIds must be an array with ids';

        this.turnOffAllHighlights();

        for (let i = 0; i < nodeIds.length; i++) {
            let id = nodeIds[i];

            let node = this.body.nodes[id];
            if (!node) {
                throw new RangeError('Node with id "' + id + '" not found');
            }

            this.highlightObject(node);
        }

        this.body.emitter.emit('_requestRedraw');
    }

    /**
     * Validate the highlighted nodes: remove ids of nodes which no longer exist
     * @private
     */
    updateHighlightedNodes() {
        for (let nodeId in this.highlightedNodes) {
            if (this.highlightedNodes.hasOwnProperty(nodeId)) {
                if (!this.body.nodes.hasOwnProperty(nodeId)) {
                    delete this.highlightedNodes[nodeId];
                }
            }
        }
    }
}

export default HighlightHandler;