/**
 * HistoryManager implements the Memento Pattern for Undo/Redo state management.
 * Demonstrates OOP: Memento Pattern, Command History.
 */
export class HistoryManager {
  constructor(maxHistory = 30) {
    this._undoStack = [];
    this._redoStack = [];
    this._maxHistory = maxHistory;
  }

  get canUndo() {
    return this._undoStack.length > 0;
  }

  get canRedo() {
    return this._redoStack.length > 0;
  }

  /**
   * Push a snapshot of current card state before a mutation.
   * @param {Object} cardSnapshot - JSON representation of the GreetingCard
   */
  pushState(cardSnapshot) {
    if (!cardSnapshot) return;
    this._undoStack.push(JSON.stringify(cardSnapshot));
    if (this._undoStack.length > this._maxHistory) {
      this._undoStack.shift();
    }
    // Clear redo stack on new action
    this._redoStack = [];
  }

  /**
   * Undo to the previous state.
   * @param {Object} currentState - Current card snapshot to store in redo
   * @returns {Object|null} The previous state object, or null
   */
  undo(currentState) {
    if (!this.canUndo) return null;
    const previous = this._undoStack.pop();
    if (currentState) {
      this._redoStack.push(JSON.stringify(currentState));
    }
    return JSON.parse(previous);
  }

  /**
   * Redo to the next state.
   * @param {Object} currentState - Current card snapshot to store in undo
   * @returns {Object|null} The next state object, or null
   */
  redo(currentState) {
    if (!this.canRedo) return null;
    const next = this._redoStack.pop();
    if (currentState) {
      this._undoStack.push(JSON.stringify(currentState));
    }
    return JSON.parse(next);
  }

  clear() {
    this._undoStack = [];
    this._redoStack = [];
  }
}
