'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _join = require('../deps/utils/join');

var _join2 = _interopRequireDefault(_join);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WORKFLOW_PATH = 'workflow';

/**
 * The `Workflow` class wraps a workflow.
 *
 * **Cannot directly be instantiated**
 */

var Workflow = function (_Base) {
  _inherits(Workflow, _Base);

  /**
   * Creates a `Workflow`.
   * @param {object} workflow - The initial workflow object. This User object will be extended with workflow properties.
   * @param {object} opts - The configuration options.
   * @param {string} opts.nuxeo - The {@link Nuxeo} object linked to this workflow.
   * @param {string} [opts.documentId] - The attached document id of this workflow, if any.
   */

  function Workflow(workflow, opts) {
    _classCallCheck(this, Workflow);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Workflow).call(this, opts));

    _this._nuxeo = opts.nuxeo;
    _this._documentId = opts.documentId;
    (0, _extend2.default)(true, _this, workflow);
    return _this;
  }

  /**
   * Fetches the tasks of this workflow.
   * @param {object} [opts] - Options overriding the ones from this object.
   * @returns {Promise} A promise object resolved with the tasks.
   */


  _createClass(Workflow, [{
    key: 'fetchTasks',
    value: function fetchTasks() {
      var _this2 = this;

      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var options = this._computeOptions(opts);
      return this._buildTasksRequest().get(options).then(function (_ref) {
        var entries = _ref.entries;

        options.nuxeo = _this2._nuxeo;
        options.documentId = _this2.uid;
        var tasks = entries.map(function (task) {
          return new _task2.default(task, options);
        });
        return tasks;
      });
    }

    /**
     * Fetches this workflow graph.
     * @param {object} [opts] - Options overriding the ones from this object.
     * @returns {Promise} A promise object resolved with the workflow graph.
     */

  }, {
    key: 'fetchGraph',
    value: function fetchGraph() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var options = this._computeOptions(opts);
      var path = (0, _join2.default)(WORKFLOW_PATH, this.id, 'graph');
      return this._nuxeo.request(path).get(options);
    }

    /**
     * Builds the correct `Request` object depending of wether this workflow is attached to a document or not.
     * @returns {Request} A request object.
     */

  }, {
    key: '_buildTasksRequest',
    value: function _buildTasksRequest() {
      if (this._documentId) {
        var path = (0, _join2.default)('id', this._documentId, '@workflow', this.id, 'task');
        return this._nuxeo.request(path);
      }
      return this._nuxeo.request('task').queryParams({
        workflowInstanceId: this.id
      });
    }
  }]);

  return Workflow;
}(_base2.default);

exports.default = Workflow;
module.exports = exports['default'];