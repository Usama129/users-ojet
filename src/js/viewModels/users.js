define(
  ['accUtils',
   'knockout',
   'ojs/ojmodel',
   'ojs/ojcollectiondataprovider',
   'ojs/ojarraydataprovider',
   'ojs/ojlabel',
   'ojs/ojchart',
   'ojs/ojlistview',
   'ojs/ojavatar',
   'ojs/ojtable',
   'ojs/ojarraytabledatasource',
   'ojs/ojbootstrap',
   'ojs/ojcheckboxset',
   'ojs/ojbutton',
   'ojs/ojdialog',
   'ojs/ojinputtext'
  ],
  function (accUtils, ko, Model, CollectionDataProvider, ArrayDataProvider, ArrayTableDataSource) {

    function UsersViewModel() {
      var self = this;  //generated code
      
      self.userData = ko.observableArray();
    
      self.itemData = ko.observable('');             //holds data for Item details

      self.pieSeriesValue = ko.observableArray([]);  //holds data for pie chart

      // Activity selection observables
      self.activitySelected = ko.observable(false);
      self.selectedActivity = ko.observable();
      self.firstSelectedActivity = ko.observable();

      // Item selection observables
      self.itemSelected = ko.observable(false);
      self.selectedItem = ko.observable();
      self.firstSelectedItem = ko.observable();
      
      self.currentUserId = ko.observable(555);
      self.currentUserName = ko.observable("default");
      self.currentUserSex = ko.observable("default");
      self.currentUserBirthDate = ko.observable("default");

    this.UsersCol = ko.observable();

    this.somethingChecked = ko.observable(false);

    this.checkSelected = (event) => {
                  let checked = this.findUserIds()
                  if (checked.length > 0) {
                    this.somethingChecked(true)
                  } else {
                    this.somethingChecked(false)
                  }
                  
              };

      //REST endpoint
     var usersREST = "http://localhost:5000/"
    
        $.getJSON(usersREST + "users").
        then(function (users) {
            $.each(users, function () {
                self.userData.push({
                    id: this.id,
                    name: this.name,
                    sex: this.sex,
                    birthDate: this.birthDate
                });
            });
        }).catch(function(error){
          if (error.status === 503)
            alert("Cannot reach server, try again later")
        });
        
        self.usersDataSource = new oj.ArrayTableDataSource(
        self.userData,
        {idAttribute: 'id'}
        );

        this.findUserIds = () => {
                  let selectedIdsArray = [];
                  const divs = document.getElementsByTagName("oj-checkboxset");
                  for (let i = 0; i < divs.length; i++) {
                      const cbComp = divs[i];
                      if (cbComp.value && cbComp.value.length) {
                          selectedIdsArray.push(cbComp.value[0]);
                      }
                  }
                  return selectedIdsArray;
              };

            this.openAddUserDialog = () => {
                 this.currentUserId("")
                  this.currentUserName("")
                  this.currentUserSex("")
                  this.currentUserBirthDate("")
                  document.getElementById("addUserDialog").open();
                  
              };
              
               this.cancelAdd = () => {
                  document.getElementById("addUserDialog").close();
                  return true;
              };
          
           this.validateInputData = function(data){
                if (data.sex !== 'M' && data.sex !== 'm' && data.sex !== 'F' && data.sex !== 'f')
                    return false
                if (isNaN(data.id))
                    return false
                return true
             }
          
        this.showUpdateUserDialog = (data, event) => {
                    
                    this.tempUserData = {id: data.id, name: data.name, sex: data.sex, birthDate: data.birthDate}
                    this.currentUserId(data.id)
                  this.currentUserName(data.name)
                  this.currentUserSex(data.sex)
                  this.currentUserBirthDate(data.birthDate)
                  document.getElementById("editDialog").open();
                  
              };
         this.cancelDialog = () => {
                  document.getElementById("editDialog").close();
                  return true;
              };
       

        this.updateUser = (event) => {
               
                 let newUserData = {id : this.currentUserId(), name: this.currentUserName(), sex: this.currentUserSex(), birthDate: this.currentUserBirthDate()}
                 
                 if (!this.validateInputData(newUserData))
                {
                    alert("User data is in incorrect format")
                    return
                }
                 
                 $.ajax({
                        url: usersREST + 'update',
                        type: 'PUT',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(newUserData),
                        dataType: "json",
                        success: function(result) {
                            
                            self.userData.remove( function (item) { return item.id === newUserData.id; } )
                            self.userData.push(newUserData)
                            
                            self.userData(self.userData.sorted(function (left, right) {
                                   return left.id < right.id ? -1 : 1 
                                }));
                            document.getElementById("editDialog").close();
                        }
                    });
                 
              };
              
              
         this.addUser = (event) => {
               let newUserData = {id : this.currentUserId(), name: this.currentUserName(), sex: this.currentUserSex(), birthDate: this.currentUserBirthDate()}
                 
               if (!this.validateInputData(newUserData))
                {
                    alert("User data is in incorrect format")
                    return
                }
                
                 $.ajax({
                        url: usersREST + 'add',
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(newUserData),
                        dataType: "json",
                        success: function(result) {
                              if (result !== "Duplicate entry"){
                                  self.userData.push(newUserData)
                                  
                                  self.userData(self.userData.sorted(function (left, right) {
                                        return left.id < right.id ? -1 : 1 
                                      }));
                                  document.getElementById("addUserDialog").close();
                              }
                              else {
                                  alert("A user with this ID already exists")
                              }
                        }
                    });
                 
              };


        this.deleteUser = (event, data) => {
                  let userIds = [];
                  userIds = this.findUserIds();
                  for (let id of userIds){
                    $.ajax({
                        url: usersREST + 'delete?id='+id,
                        type: 'DELETE',
                        
                        success: function(result) {
                            self.userData.remove( function (item) { return item.id === id; } )
                            
                        }
                    });

                  }
                  
                  
              };

      /**
       * Handle selection from Activities list
       */
      self.selectedActivityChanged = function (event) {
        // Check whether click is an Activity selection or a deselection
        if (event.detail.value.length != 0) {
          // If selection, populate and display list
          // Create variable for items list using firstSelectedXxx API from List View
          //var itemsArray = self.firstSelectedActivity().data.items;
          // Populate items list using DataProvider fetch on key attribute
          // self.itemsDataProvider(new ArrayDataProvider(itemsArray, { keyAttributes: 'id' }))

          var activityKey = self.firstSelectedActivity().data.id;
          //REST endpoint for the items list
          var url = "https://apex.oracle.com/pls/apex/oraclejet/lp/activities/" + activityKey + '/items/';

          function parseItem(response) {
            var img = 'css/images/product_images/jet_logo_256.png'
            if (response) {
              //if the response contains items, pick the first one
              if (response.items && response.items.length !== 0) { response = response.items[0]; }
              //if the response contains an image, retain it
              if (response.image !== null) { img = response['image']; }
              return {
                id: response['id'],
                name: response['name'],
                price: response['price'],
                short_desc: response['short_desc'],
                quantity: response['quantity'],
                quantity_instock: response['quantity_instock'],
                quantity_shipped: response['quantity_shipped'],
                activity_id: response['activity_id'],
                image: img
              };
            }
          }

          var itemModel = Model.Model.extend({
            urlRoot: url,
            parse: parseItem,
            idAttribute: 'id'
          });

          self.myItem = new itemModel();
          self.itemCollection = new Model.Collection.extend({
            url: url,
            model: self.myItem,
            comparator: 'id'
          });

          /*
          *An observable called itemsDataProvider is already bound in the View file
          *from the JSON example, so you don't need to update dashboard.html
          */
          self.myItemCol = new self.itemCollection();
          self.itemsDataProvider(new CollectionDataProvider(self.myItemCol));

          // Set List View properties
          self.activitySelected(true);
          self.itemSelected(false);
          // Clear item selection
          self.selectedItem([]);
          self.itemData();
        } else {
          // If deselection, hide list
          self.activitySelected(false);
          self.itemSelected(false);
        }
      };

      /**
       * Handle selection from Activity Items list
       */
      self.selectedItemChanged = function (event) {
        // Check whether click is an Activity Item selection or deselection
        if (event.detail.value.length != 0) {
          // If selection, populate and display Item details
          // Populate items list observable using firstSelectedXxx API
          self.itemData(self.firstSelectedItem().data);
          // Create variable and get attributes of the items list to set pie chart values
          var pieSeries = [
            { name: "Quantity in Stock", items: [self.itemData().quantity_instock] },
            { name: "Quantity Shipped", items: [self.itemData().quantity_shipped] }
          ];
          // Update the pie chart with the data
          self.pieSeriesValue(pieSeries);
          self.itemSelected(true);
        } else {
          // If deselection, hide list
          self.itemSelected(false);
        }
      };

	  
      // The following 3 functions are not addressed in this tutorial.
	  
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * This section is standard navdrawer starter template code
       */

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function () {
        accUtils.announce('Users page loaded.', 'assertive');
        document.title = "Users";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

        
    return new UsersViewModel();
    
    
  }
);