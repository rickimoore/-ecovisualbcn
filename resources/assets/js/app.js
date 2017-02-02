
/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example', require('./components/Example.vue'));

const app = new Vue({
    el: '#app',
    data: function () {
        return {
            scene: '',
            camera: '',
            cube: '',
            renderer: '',
            controls: '',
            onRenderFcts: '',
            apiCycle: '',
            hasMoved: false,
            push: true,
            trash: true,
            isIntroView: true,
            isSceneView: false,
            isSceneLoading: false,
            isLoadBar: false,
            isInstallation: false,
            visualCount: 0,
            timer: 0,
            count: 0,
            callCount: 0,
            retries: 0,
            trashBinCallBack:'',
            keywords: [
                'contamination', 'reciclaje', 'sostenibilidad', 'medioambiente', 'ecologic', 'ecovisualbcn'
            ],
            gravityConstraint: 3.8,
            ecovisualTweetRepository: [],
            defaultTweets: [],
            activeTweets: [],
            tweetBin: []
        }
    },
    mounted(){
        this.initIntroScene();
    },
    methods: {
        initIntroScene: function () {
            var self = this;
            var theater = theaterJS();
            theater
                .on('type:start, erase:start', function () {
                    // add a class to actor's dom element when he starts typing/erasing
                    var actor = theater.getCurrentActor()
                    actor.$element.classList.add('is-typing')
                })
                .on('type:end', function () {
                    // and then remove it when he's done
                    var actor = theater.getCurrentActor()
                    self.initChangeScene();
                    actor.$element.classList.remove('is-typing')
                })

            theater
                .addActor('ecovisual')

            theater
                .addScene('ecovisual:#ECOVISUALBCN', 400)
        },
        initChangeScene: function () {
            var self = this;
            this.isSceneLoading = true;
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                self.isLoadBar = true;
                clearTimeout(self.timer);
                self.timer = setTimeout(function () {
                   self.isIntroView = false;
                   clearTimeout(self.timer);
                   self.timer = setTimeout(function () {
                       self.isInstallation = true;
                       self.initInstallationScene();
                   }, 1000);
                }, 2000);
            }, 1500);
        },
        initInstallationScene: function () {
                var self = this;
                var theater = theaterJS();
                theater
                    .on('type:start, erase:start', function () {
                        // add a class to actor's dom element when he starts typing/erasing
                        var actor = theater.getCurrentActor()
                        actor.$element.classList.add('is-typing')
                    })
                    .on('type:end', function () {
                        // and then remove it when he's done
                        var actor = theater.getCurrentActor()
                        self.initEcoScene();
                        actor.$element.classList.remove('is-typing')
                    })

                theater
                    .addActor('instOne', { accuracy: 0.7, speed: .7 })

                theater
                    .addScene('instOne:#ecovisualbcn #ecologic #contaminaton #reciclaje #sostenibilidad #medioambiente', 1000)

        },
        initEcoScene: function () {
            var self = this;

            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                self.isInstallation = false;
                clearTimeout(self.timer);
                self.timer = setTimeout(function () {
                    self.isSceneView = true;
                    self.searchTwitter(self.keywords);
                    self.initPhysics();
                }, 1500);
            }, 1000);
        },
        searchTwitter: function (list) {
            for(let i = 0; i < list.length; i++){
                this.getHttp('/api/v1/twitter_search/' + list[i], this.setThoughts, this.error);
            }
        },
        setThoughts: function (results) {
            if(results.url == '/api/v1/twitter_search/ecovisualbcn'){
                this.visualCount = results.data.statuses.length;
               return this.setTweets(results.data.statuses, 'ecovisualTweetRepository')
            }

            this.setTweets(results.data.statuses, 'defaultTweets');
        },
        secondaryThoughts: function (results) {
            if(results.url == '/api/v1/twitter_search/ecovisualbcn'){
                for(let i = 0; i < results.data.statuses.length - this.visualCount; i++){
                    console.log(i);
                    this.ecovisualTweetRepository.push(results.data.statuses[i]);
                }

                this.visualCount = results.data.statuses.length;
            }
        },
        setTweets: function (tweets, destination) {
            for(let i = 0; i < tweets.length; i++){
                this[destination].push(tweets[i]);
            }
            this.callCount++;

            if(this.callCount == this.keywords.length){
                this.initCycle(this.pushTweets,1000, 10, 'push');
            }
        },
        initCycle: function (setcallback, setfactor, times, cycle) {
                let self = this;
            function setDeceleratingTimeout(callback, factor, times)
            {
                var internalCallback = function(tick, counter) {
                    return function() {
                        if (--tick >= 0) {

                            window.setTimeout(internalCallback, ++counter * factor);

                            callback();
                        } else {
                            if(self[cycle]){
                                setDeceleratingTimeout(callback,setfactor, times);
                            }
                        }
                    }
                }(times, 0);

                window.setTimeout(internalCallback, factor);
            };

                setDeceleratingTimeout(setcallback,setfactor, times);
        },
        pushTweets: function () {
            var self = this;

            //set the new tweet disposal timeout
            if(this.activeTweets.length > 0){
                this.activeTweets[this.activeTweets.length - 1].timer = setTimeout(function () {
                    self.tweetBin.push(self.activeTweets[self.activeTweets.length - 1]);
                    self.activeTweets.shift();
                }, 4000);
            }


            if(this.ecovisualTweetRepository.length > 0){
                this.activeTweets.push(this.ecovisualTweetRepository[0]);
                return this.ecovisualTweetRepository.shift();
            }

            if(this.defaultTweets[0].retweeted_status){
                this.retryTweet();
                return this.defaultTweets.shift();
            }

            this.activeTweets.push(this.defaultTweets[0]);
            this.defaultTweets.shift();
        },
        retryTweet: function () {
          this.retries++;
          console.log(this.retries);
          if(this.retries < 80){
              this.getHttp('/api/v1/twitter_search/ecovisualbcn', this.secondaryThoughts, this.error);
          }
        },
        success: function (results) {
            console.log(results)
        },
        error: function (results) {
            console.log(results)
        },
        makeRender: function () {
            this.renderer.render(this.scene, this.camera);
        },
        initPhysics: function () {
            let self = this;

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.renderer	= new THREE.WebGLRenderer({canvas: document.getElementById('ecoscene')});
            this.renderer.setClearColor('0x000000');
            this.renderer.setSize( window.innerWidth, window.innerHeight );


            this.onRenderFcts= [];
            this.scene	= new THREE.Scene();
            this.camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 4000);
            this.camera.position.z = 1650;
            this.camera.position.y = 550;
            this.camera.rotation.x = 205;

            //////////////////////////////////////////////////////////////////////////////////
            //		oimo world							//
            //////////////////////////////////////////////////////////////////////////////////

            this.world	= new OIMO.World(1/120, 2, 8);
            this.world.gravity = new OIMO.Vec3(0, -12, 0);
            setInterval(function(){
                self.world.step()
            }, 1000/60);

            //////////////////////////////////////////////////////////////////////////////////
            //		Ground								//
            //////////////////////////////////////////////////////////////////////////////////

            let geometry	= new THREE.BoxGeometry(1000,500,1000);
            let material	= new THREE.MeshBasicMaterial({color:0x1E1E1E, opacity: 0.05, transparent: true});
            let mesh	= new THREE.Mesh( geometry, material );
            mesh.position.y	= -geometry.parameters.height/2;
            this.scene.add(mesh);

            let ground	= THREEx.Oimo.createBodyFromMesh(this.world, mesh, {
                move : false
            });

            let geo = {
                x: 0,
                y: 150,
                z: 0
            };

            this.createCloud(geo);

            let charm = {
                height: 70,
                width: 25,
                depth: 25,
                color: 0xff0000
            };

            geo = {
                x: (Math.random()-0.5)*40,
                y: -50,
                z: 1
            };

            this.createPlant(charm, geo);

            /*
            Add ambient light and directional light to scene;
             */

            let ambiant = new THREE.AmbientLight(0xffffff, .3);

            let light = new THREE.PointLight( 0xffffff, 6.0, 1000 ); // soft white light

            light.position.z = 850;
            light.position.y = 400;
            light.rotation.x = 50;

            this.scene.add( ambiant );
            this.scene.add( light );

            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            this.controls.addEventListener('change', this.makeRender);



            //////////////////////////////////////////////////////////////////////////////////
            //		render the scene						//
            //////////////////////////////////////////////////////////////////////////////////
            self.onRenderFcts.push(function(){
                self.renderer.render( self.scene, self.camera );
            });

            //////////////////////////////////////////////////////////////////////////////////
            //		loop runner							//
            //////////////////////////////////////////////////////////////////////////////////
            let lastTimeMsec= null
            requestAnimationFrame(function animate(nowMsec){
                // keep looping
                requestAnimationFrame( animate );
                // measure time

                lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
                let deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
                lastTimeMsec	= nowMsec
                // call each update function
                self.onRenderFcts.forEach(function(onRenderFct){
                    onRenderFct(deltaMsec/1000, nowMsec/1000)
                })
            })
        },
        initParticleDrop: function (range, setFactor, count) {
            let self = this;
            function setDeceleratingTimeout(callback, factor, times)
            {
                let internalCallback = function(tick, counter) {
                    return function() {
                        if (--tick >= 0) {
                            window.setTimeout(internalCallback, ++counter * factor);
                            self.dropParticle(range);
                        } else {
                            if(self.count <= 200){
                                setDeceleratingTimeout(self.dropParticle(range), setFactor, count);
                            }
                        }
                    }
                }(times, 0);

                window.setTimeout(internalCallback, factor);
            };

            setDeceleratingTimeout(this.dropParticle(range), setFactor, count);
        },
        dropParticle: function (range) {
            let self = this;
            for(let i = 0; i < range; i++ ){
                this.count++;
                (function(){
                    //////////////////////////////////////////////////////////////////////////////////
                    //		create the mesh
                    //////////////////////////////////////////////////////////////////////////////////

                    let radius	= 10 + (Math.random()-0.5)*.5;
                    let geometry	= new THREE.SphereGeometry( radius );

                    let material	= new THREE.MeshPhongMaterial({color:0x004400});
                    let mesh	= new THREE.Mesh( geometry, material );

                    self.scene.add( mesh );

                    mesh.position.x	= (Math.random()-0.5) * 170;
                    mesh.position.y	= 450 + (Math.random()-0.5)*45;
                    mesh.position.z	= (Math.random()-0.5)*50;

                    //////////////////////////////////////////////////////////////////////////////////
                    //		create a body for this mesh
                    //////////////////////////////////////////////////////////////////////////////////

                    // create IOMO.Body from mesh
                    let body	= THREEx.Oimo.createBodyFromMesh(self.world, mesh);

                    // add an updater for them
                    self.onRenderFcts.push(function(delta){
                        THREEx.Oimo.updateObject3dWithBody(mesh, body)
                    })

                    //////////////////////////////////////////////////////////////////////////////////
                    //		if body is too low, reset it
                    //////////////////////////////////////////////////////////////////////////////////

                    // if the position.y < 20, reset the position
                    self.onRenderFcts.push(function(delta){
                        if( mesh.position.y < -120 ){
                            mesh.position.x	= (Math.random()-0.5) * 170;
                            mesh.position.y	= 450 + (Math.random()-0.5)*45;
                            mesh.position.z	= (Math.random()-0.5)*50;
                            body.resetPosition(mesh.position.x, mesh.position.y, mesh.position.z);
                        }
                    })
                })()
            }
        },
        createCloud: function (geo) {
            this.loadObj('/models/cloud_without_many_things.obj', geo);
            var self = this;
            setTimeout(function () {
                //////////////////////////////////////////////////////////////////////////////////
                //		add an object and make it move					//
                //////////////////////////////////////////////////////////////////////////////////

                self.initParticleDrop(2,100,50);
            }, 5000);
        },
        createPlant: function (charm, geo) {
            let geometry	= new THREE.BoxGeometry(charm.width,charm.height,charm.depth);
            let material	= new THREE.MeshBasicMaterial({color: charm.color});

            let mesh	= new THREE.Mesh( geometry, material );

            mesh.position.x	= geo.x;
            mesh.position.y	= 50;
            mesh.position.z	= geo.z;

            this.loadObj('/models/NewPlant_02.obj',geo, mesh, 10,true);

        },
        loadObj: function (model, geo, mesh, scale, physics) {
            let self = this;
            let objLoader = new THREE.OBJLoader();
            objLoader.load(model, function(obj) {
                obj.position.x	= geo.x;
                obj.position.y	= geo.y;
                obj.position.z	= geo.z;
                if(scale){
                    obj.scale.set(6,6,6);
                }
                self.scene.add( obj );
                if(mesh){
                    // self.scene.add( mesh );
                }

                if(physics){
                    THREEx.Oimo.createBodyFromMesh(self.world, mesh, {
                        move : false
                    });
                }
            })
        },


        //vue resource *version 1.0.3 methods
        getHttp: function (url,callback, errorCallback) {
            this.$http.get(url).then((callback), (errorCallback));
        },
    }
});
