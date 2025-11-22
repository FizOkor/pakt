"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-plain-obj@2.1.0";
exports.ids = ["vendor-chunks/is-plain-obj@2.1.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/is-plain-obj@2.1.0/node_modules/is-plain-obj/index.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/is-plain-obj@2.1.0/node_modules/is-plain-obj/index.js ***!
  \**********************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = value => {\n\tif (Object.prototype.toString.call(value) !== '[object Object]') {\n\t\treturn false;\n\t}\n\n\tconst prototype = Object.getPrototypeOf(value);\n\treturn prototype === null || prototype === Object.prototype;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vaXMtcGxhaW4tb2JqQDIuMS4wL25vZGVfbW9kdWxlcy9pcy1wbGFpbi1vYmovaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFVTRVJcXERvd25sb2Fkc1xccGFrdFxcbm9kZV9tb2R1bGVzXFwucG5wbVxcaXMtcGxhaW4tb2JqQDIuMS4wXFxub2RlX21vZHVsZXNcXGlzLXBsYWluLW9ialxcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcblx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Y29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcblx0cmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG59O1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/is-plain-obj@2.1.0/node_modules/is-plain-obj/index.js\n");

/***/ })

};
;