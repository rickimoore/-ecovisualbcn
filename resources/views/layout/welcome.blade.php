<!doctype html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:image" content="https://mavrik.frb.io/image/avatar/avatar-01.jpg" />
    <meta property="og:title" content="MAVRIK.IO by Ricki Moore" />
    <meta property="og:description" content="An Unorthodox System From An Independent Mind." />
    <link rel="stylesheet" href="/css/app.css">

    <title>EcoVisual</title>

    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>

</head>
<body>

@yield('main')

<script type="text/javascript" src="/dependencies/three.js"></script>
<script type="text/javascript" src="/dependencies/DDSLoader.js"></script>
<script type="text/javascript" src="/dependencies/MTLLoader.js"></script>
<script type="text/javascript" src="/dependencies/OBJLoader.js"></script>
<script type="text/javascript" src="/dependencies/TrackballControls.js"></script>
<script type="text/javascript" src="/dependencies/OrbitControls.js"></script>
<script type="text/javascript" src="/dependencies/oimo.js"></script>
<script type="text/javascript" src="/dependencies/threex.oimo.js"></script>
<script type="text/javascript" src="/js/theater.min.js"></script>
<script type="text/javascript" src="/js/app.js"></script>
</body>
</html>