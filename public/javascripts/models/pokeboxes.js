var PokeBoxes = function() {
	this.boxes = [];

	/**
	 * Load boxes from User local storage.
	 */
	this.load = function() {
		var self = this;
		try {
			var myBoxes = JSON.parse(localStorage.getItem('myBoxes')) || [];
			$.each(myBoxes, function(idx, myBox){
				self.boxes.push(new PokeBox(myBox.name, myBox.type, myBox.pokemons));
			});
		} catch(e) {
			this.boxes = [];
		}
	}
	
	/**
	 * Save boxes to User local storage.
	 */
	this.save = function() {
		console.log(this.boxes);
		localStorage.setItem('myBoxes', JSON.stringify(this.boxes));
	}

	/**
	 * Get all boxes
	 * @return {Array} Boxes
	 */
	this.getBoxes = function() {
		return this.boxes;
	}

	/**
	 * Check if a given name is unique among stored boxes
	 * @param  {String}  name A box name
	 * @return {Boolean} isUnique
	 */
	this.isBoxNameUnique = function(name) {
		var isUnique = true;
		$.each(this.boxes, function(idx, box) {
			if(box.name === name) {
				isUnique = false;
				return false;
			}
		});
		return isUnique;
	}

	/**
	 * Get a stored box by its name.
	 * @param  {String}  name A box name
	 * @return {Box|Boolean} Box if found, false otherwise
	 */
	this.getBoxByName = function(name) {
		var foundBox = false;
		$.each(this.boxes, function(idx, box) {
			if(box.name === name) {
				foundBox = box;
				return false;
			}
		});
		return foundBox;
	}

	/**
	 * Add a new box.
	 * Only boxes with unique name will be added.
	 * @param {Box} box New box
	 * @return {Boolean} Box added
	 */
	this.addBox = function(box) {
		var isBoxAdded = false;
		// Ensure box name is unique
		if(this.isBoxNameUnique(box.name)) {
			this.boxes.push(box); // Add box
			isBoxAdded = true;
		}

		return isBoxAdded;
	}

	/**
	 * Update a stored box with a new one
	 * @param  {Box} newBox
	 * @return {Boolean}
	 */
	this.updateBox = function(newBox) {
		var self = this;
		var isUpdated = false;
		$.each(this.boxes, function(idx, box) {
			if(box.name === newBox.name) {
				self.boxes[idx] = newBox;
				isUpdated = true;
				return false;
			}
		});
		return isUpdated;
	}

	/**
	 * Remove a stored box, according its name
	 * @param  {Box} boxToRemove Box to remove
	 * @return {Boolean} Is Box removed
	 */
	this.removeBox = function(boxToRemove) {
		var self = this;
		var isBoxRemoved = false;
		$.each(this.boxes, function(idx, box) {
			if(box.name === boxToRemove.name) {
				self.boxes.splice(idx, 1); // Remove box from boxes
				isBoxRemoved = true;
				return false;
			}
		});

		return isBoxRemoved;
	}
}