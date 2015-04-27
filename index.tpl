<!DOCTYPE html>
<!--(if target dist || dev)>
{{banner}}
<!(endif)-->
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>E-Meeting</title>
    
    <!--(if target dev)><!-->
    <link rel="stylesheet" href="style/css/app.css">
    <!--<!(endif)-->
    
    <!--(if target dist)>
      <link rel="stylesheet" href="style/css/{{appname}}.min.css?v={{rlsdate}}">
    <!(endif)-->

    <!--(if target dev)><!-->
      <script type="text/javascript">
          var $CONFIG = {};
          $CONFIG['version'] = 'Test';
          $CONFIG['release_time'] = 'Test';
      </script>
    <!--<!(endif)-->

    <!--(if target dist)>
    <script type="text/javascript">
        var $CONFIG = {};
        $CONFIG['version'] = '{{version}}';
        $CONFIG['release_time'] = '{{rlsdate2}}';
    </script>
    <!(endif)-->
  </head>
  <body> 
        <div class="statusbar-overlay"></div>
        <div class="panel-overlay"></div>

        <div class="views fixed-through">
            <div id="ourView" class="view view-main">
              
                <!-- navbar-through -->
               <div class="pages toolbar-fixed">
                 <div data-page="ourView" class="page page-index navbar-fixed toolbar-fixed no-swipeback">
                   <!-- navbar start -->               
                   <div class="navbar hide">
                     <div class="navbar-inner">

                       <div class="left">
                         <a href="page/userConfig.html"  class="refresh-click link"> <i class="icon ios7-gear"></i>
                         </a>
                       </div>

                       <div class="center sliding i18n" data-i18n="app.name">{{i}}</div>
                     </div>
                   </div>
                   <!-- navbar end -->               
                   <div class="page-content">
                     <div class="content-block">
                       <a href="page/createa.html" class='link'>
                         add
                       </a>
                     </div>
                   </div>
                   <!-- toolbar start -->               
                   <div class="toolbar hide">
                     <div class="list-block">
                       <ul>
                         <li>
                           <a href="page/history.html" class="item-link item-content">
                             <div class="item-inner">
                               <div class="item-title i18n" data-i18n="index.history_meeting">{{historyMeeting}}</div>
                               <div class="item-after">
                                 <span class="badge" id="history-count">{{historyCount}}</span>
                               </div>
                             </div>
                           </a>
                         </li>
                       </ul>
                     </div>
                   </div>
                   <!-- toolbar end --> 
                   </div>
               </div>
               
            </div>

            
        </div>

        <!-- Please ignore the 404 error when you are not running under PhoneGap environment or delete it. -->
        <script type="text/javascript" src="cordova.js"></script>

        <!--(if target dev)><!-->
        <script data-main="script/main" src="vendors/require/require.js"></script>
        <!--<!(endif)-->
        
        <!--(if target dist)>
          <script data-main="script/{{appname}}.min" src="script/require.min.js?v={{rlsdate}}"></script>
        <!(endif)-->

  </body>
  
</html>