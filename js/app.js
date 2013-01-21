/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var serviceURL = "http://localhost/culinaria/";
var myScroll;
function loaded() {
    myScroll = new iScroll('wrapper', {
        snap: 'li',
        momentum: false,
        hScrollbar: false,
        useTransform: false,
        onScrollStart: function () {
            $('.btn-text a').addClass("dragging");
        },
        onScrollEnd: function () {
            $('.btn-text a').removeClass("dragging");
           
        },
        onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                e.preventDefault();
        }
    });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 500); }, false);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        $("#splashscreen").css('display','block').css('display','none');
        $("body div:not(#splashscreen)").css('display','none').slideDown();
        setTimeout(resto.getItems, 500);
      
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
       
            $("#searchresto").keyup(function(){
                if($(this).val=='')
                    resto.getItems($(this.val));
                else resto.searchItems($(this).val());

            });
            
            $('#restolist').on({

                click: function () {
                if (myScroll.moved) return;  
                    $('#home').addClass('animated fadeOutLeftBig'); 
                    $(".backbutton").removeClass("backfrom-home").addClass("backfrom-itemdetail");
                    $('#itemdetail').addClass('animated fadeOutRightBig'); 
                }

            }, 'li');

            $(".backbutton").click(function(){
                var nav = $(this).attr("class").split(" ");
                var page = nav[1].split("-")[1];
                $("#"+page).removeClass().addClass('page animated fadeOutRightBig');
                $("#"+page).prev().removeClass().addClass('page animated fadeInLeftBig');
                $(".backbutton").removeClass("backfrom-"+page).addClass("backfrom-"+$("#"+page).prev().attr('id'))
                return false;
            });

           

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       //  $("body div").css('display','block');
        //$("#splashscreen").css('display','none');
    },
    showAlert:function(text){
        navigator.notification.alert(
            'You are the winner!'+text[0].tempat,  // message
            app.alertDismissed,         // callback
            'Game Over',            // title
            'Done'                  // buttonName
        );
    },
    alertDismissed: function(){

    }
};
var resto = {
    getItems:function(){
        $.getJSON(serviceURL+'data.php?action=get', function(data) {
            var items = [];
            //var itemwrap = $("#content #home ul");
            views.showItems(data);

           
            //alert(items);
            
        
        });
        
    },
    searchItems:function(s){
        $.getJSON(serviceURL+'data.php?action=get&q='+s, function(data) {
            
            //var itemwrap = $("#content #home ul");
            views.showItems(data);

           
            //alert(items);
            
        
        });
    }
};
var views = {
    showItems:function(data){
        $("#restolist *").remove();
        $.each(data, function(key, val) {
                $('#restolist').append('<li>'
                    +'<div class="btn-text">'
                    +'    <a class="item item-'+key+'">'
                    +'        <img src="'+serviceURL+'uploads/'+val.img+'" alt="" class="img-thumb" >'
                    +'        <h3 class="item-title">'+val.nama_tempat+'</h3>'
                    +'        <p>'+val.deskripsi+'</p>'
                    +'        <span class="rating"></span>'
                    +'        <span class="item-corner"></span>'
                    +'    </a>'                        
                    +'</div>'
                +'</li>');
                
                
            });
        myScroll.refresh();
    }
};



