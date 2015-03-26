var search =
webpackJsonp_name_([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.init = function () {
	  var fixedForm = document.querySelector(".search-form_fixed");
	  var fixedFormInput = fixedForm.querySelector(".search-form__query .text-input__control");
	  var staticFormInput = document.querySelector(".search-form:not(.search-form_fixed) .search-form__query .text-input__control");
	  var fixedInputOffset = parseInt(getComputedStyle(fixedForm, "").paddingTop);
	
	  function updateFixedForm() {
	    if (staticFormInput.getBoundingClientRect().top <= fixedInputOffset) {
	      if (fixedForm.classList.contains("search-form_hidden")) {
	        fixedFormInput.value = staticFormInput.value;
	      }
	      fixedForm.classList.remove("search-form_hidden");
	    } else {
	      if (!fixedForm.classList.contains("search-form_hidden")) {
	        staticFormInput.value = fixedFormInput.value;
	      }
	      fixedForm.classList.add("search-form_hidden");
	    }
	  }
	
	  window.addEventListener("scroll", updateFixedForm);
	  updateFixedForm(); // set initial state
	};

/***/ }
]);
//# sourceMappingURL=search.5c4886a698fcd0892657.js.map