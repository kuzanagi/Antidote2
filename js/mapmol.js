      var infowindow,
          placemarkers=[];
      
      
      function placeSearch(map,request)
      {
        var map=map;
        var service = new google.maps.places.PlacesService(map);
        service.search(request, 
                       function(results,status)
                       {
                        if (status == google.maps.places.PlacesServiceStatus.OK) 
                        {
                          var bounds=new google.maps.LatLngBounds();
                          for (var i = 0; i < results.length; ++i) 
                          { 
                            bounds.extend(results[i].geometry.location);
                            placemarkers.push(createMarker(results[i].geometry.location,
                                         map,
                                         'http://labs.google.com/ridefinder/images/mm_20_orange.png',
                                         results[i].name,
                                         false,
                                         {
                                          fnc:function() 
                                          {
                                            infowindow.open();
                                          }
                            
                                         }));
                          }
                          map.fitBounds(bounds);
                        }
                       }
                       );
      
      }
      
      function createMarker(latlng,map,icon,content,center,action) 
      {
        
        
        var marker = new google.maps.Marker({
          map: map,
          position: latlng,
          content:content
        });
        if(icon){marker.setIcon(icon);}
        
        if(center)
        {
          map.setCenter(latlng);
        }
        
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(this.content);
          infowindow.open(map, this);
        });
        
        if(action)
        {
          action.fnc(map,action.args);
        }
        return marker;
      }
      function initialize()
      {
        
        var location = new google.maps.LatLng(-33.8665433, 151.1956316),
            map = new google.maps.Map(document.getElementById('map'), {
                      mapTypeId: google.maps.MapTypeId.ROADMAP,
                      center: location,
                      zoom: 15
                      });
         infowindow = new google.maps.InfoWindow();
         navigator.geolocation.getCurrentPosition(function(place)
         {           
            createMarker(
                          new google.maps.LatLng(place.coords.latitude,
                                                place.coords.longitude),
                          map,
                          null,
                          'your current position',
                          true,
                          {
                           fnc:placeSearch,
                           args:{
                                 radius: 5000,
                                 types: ['restaurant'],
                                 location:new google.maps.LatLng(place.coords.latitude,
                                                                 place.coords.longitude)
                                }
                         }
                         );      
         });
      }
