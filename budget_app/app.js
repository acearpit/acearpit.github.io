var budgetController = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPerc = function (totalInc) {
        if (totalInc > 0)
            this.percentage = Math.round((this.value / totalInc) * 100);
        else
            this.percentage = '---';

    };

    Expense.prototype.getPerc = function () {
        return this.percentage;
    };

    var data = {
        all: {
            inc: [],
            exp: []
        },
        total: {
            inc: 0,
            exp: 0
        },
        percentage: 0,
        budget: 0
    };

    var budget = function (type) {
        var sum = 0;
        data.all[type].forEach(function (current) {
            sum += current.value;
        });
        data.total[type] = sum;
    };

    return {
        addItem: function (type, desc, val) {
            var newItem, ID, percent;
            if (data.all[type].length > 0) {
                ID = data.all[type][data.all[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            } else if (type === 'exp') {
                percent = Math.round((val / data.total.inc) * 100);
                newItem = new Expense(ID, desc, val, percent);
            }
            data.all[type].push(newItem);
            return newItem;
        },

        removeFromDS: function (type, id) {

            var arr = data.all[type].map(function (curr) {
                return curr.id;
            });

            var idx = arr.indexOf(id);
            if (idx !== -1) {
                data.all[type].splice(idx, 1);
            }

        },

        updateBudget: function () {
            budget('inc');
            budget('exp');
            data.budget = data.total.inc - data.total.exp;
            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calcPercentages: function () {
            data.all.exp.forEach(function (current) {
                current.calcPerc(data.total.inc);
            });
        },

        getPercentages: function () {
            var percentages;
            return percentages = data.all.exp.map(function (current) {
                return current.getPerc();
            });
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totInc: data.total.inc,
                totExp: data.total.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }
    };

})();


var UIController = (function () {

    var DOMStrings = {
        type: '.add__type',
        desc: '.add__description',
        val: '.add__value',
        inputBtn: '.add__btn',
        incContainer: '.income__list',
        expContainer: '.expenses__list',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        budgetLabel: '.budget__value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercent: '.item__percentage',
        budgetMonth: '.budget__title--month',
        budgetYear: '.budget__title--year',
    };

    var formatNumber = function (num, type) {
        var formatted, int, dec;
        var pre = (type == 'inc' ? '+ ' : '- ');
        num = Math.abs(num);
        num = num.toFixed(2);
        formatted = num.split('.');
        int = formatted[0];
        dec = formatted[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        return ((int !== "0" ? pre : '') + int + '.' + dec);
    };

    var customForEach = function (arr, fun) {
        for (var i = 0; i < arr.length; i++) {
            fun(arr[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.type).value,
                desc: document.querySelector(DOMStrings.desc).value,
                val: parseFloat(document.querySelector(DOMStrings.val).value),
            };
        },

        displayMonth: function () {
            var now, month, year;
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            document.querySelector(DOMStrings.budgetMonth).textContent = " " + months[month] + ", " + year;
        },

        toggleFields: function () {
            var fields = document.querySelectorAll(DOMStrings.type + ',' + DOMStrings.desc + ',' + DOMStrings.val);
            customForEach(fields, function (curr) {
                curr.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        addItemToUI: function (obj, type) {

            var newHtml, html, element;

            // alotting variables
            if (type === 'inc') {
                element = DOMStrings.incContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMStrings.expContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percent%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                html = html.replace('%percent%', obj.percent);
            }

            //format the html to show changes
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert new object
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        displayBudget: function (obj) {
            var type = obj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '...';
            }
        },

        displayPercentages: function (percentages) {
            var DOMele = document.querySelectorAll(DOMStrings.expPercent);
            customForEach(DOMele, function (ele, idx) {
                ele.textContent = percentages[idx];
                if (percentages[idx] > 0) {
                    ele.textContent += '%';
                }
            });
        },

        removeFromUI: function (targ) {
            var ele = document.getElementById(targ);
            ele.parentNode.removeChild(ele);
        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.desc + ', ' + DOMStrings.val);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        getDOM: function () {
            return DOMStrings;
        }
    };

})();


var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOM();
        document.querySelector(DOM.inputBtn).addEventListener('click', addCtrlItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addCtrlItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', deleteCtrlItem);
        document.querySelector(DOM.type).addEventListener('change', UICtrl.toggleFields);
    };

    var calculateBudget = function () {

        // 1. Calculate the budget.
        budgetCtrl.updateBudget();

        // 2. Get The Updated Budget.
        var budget = budgetCtrl.getBudget();

        // 2. Display the budget to the UI.
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {

        // 1. Calculate percentages.
        budgetCtrl.calcPercentages();

        // 2. Get Updated percentages from budget controller.
        var percentages = budgetCtrl.getPercentages();

        // 3. Display the new Percentages.
        UICtrl.displayPercentages(percentages);

    };

    var addCtrlItem = function () {

        var input, newItem;

        // 1. Get the field input data.
        var input = UICtrl.getInput();

        if (input.desc !== "" && !isNaN(input.val) && input.val !== 0) {

            // 2. Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.desc, input.val);
            // console.log(newItem);

            // 3. Add the item to the UI.
            UICtrl.addItemToUI(newItem, input.type);

            // 4. Clearing the fields.
            UICtrl.clearFields();

            // 5. Calc aand Update Budget
            calculateBudget();

            // 6. Calculate and Update Percentages.
            updatePercentages();

        }

    };

    var deleteCtrlItem = function (event) {
        var targ = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (targ) {

            var arr = targ.split('-');
            var type = arr[0];
            var id = parseInt(arr[1]);

            // 1. Delete Item from the data structure.
            budgetCtrl.removeFromDS(type, id);

            // 2. Delete Item From The UI.
            UICtrl.removeFromUI(targ);

            // 3. Update and show the budget.
            calculateBudget();

            // 4. Calculate and Update Percentages.
            updatePercentages();

        }
    };

    return {
        init: function () {
            UICtrl.displayMonth();
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();