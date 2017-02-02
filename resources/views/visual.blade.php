@extends('layout.welcome')

@section('main')
    <div id="app">
        <transition name="fade">
            <div v-show="isIntroView" class="eco--intro">
                <div id="ecovisual" class="actor__content"></div>
                <transition name="fade">
                    <div class="scene--load" v-show="isSceneLoading">
                        <div class="progress" :class="{'full--progress': isLoadBar}"></div>
                    </div>
                </transition>
            </div>
        </transition>
        <transition name="fade">
            <div v-show="isInstallation" class="eco--installation">
                <div class="installation">
                    <p>El pensamiento ecológico se nutre y se difunde por las redes sociales mediante distintos tags. El que da nombre al proyecto se ha creado expresamente para este. Es prioritario en el orden de aparición respecto a los otros.
                    </p>
                    <p> Esta instalación muestra lo consciente que es la gente frente a un tema importante como lo es la Ecología. Así, cuanta más difusión en twitter sobre temas ecológicos (mediante los hashtags que se muestran debajo) más lluvia caerá sobre el brote. Al hacer crecer la cantidad de ideas promovemos que el mundo se conciencie, ya que el pensamiento es el primer paso para que algo pueda suceder. </p>
                    <p id="instOne" class="text"></p>
                </div>
            </div>
        </transition>
        <div v-show="isSceneView" class="eco--secene">
            <canvas id="ecoscene" style="background: #000000"></canvas>
            <transition-group name="slideUp" tag="div" class="ecoscene--tweets">
                <div class="tweet" v-for="tweet in activeTweets" v-bind:key="tweet">
                    <div class="tweet--head">
                        <div class="head--icon">
                            <img src="/image/icons/twitter-logo-silhouette.svg" alt="twitter">
                        </div>
                        <div class="head--user">
                            <span>@{{tweet.user.name}}</span>
                        </div>
                    </div>
                    <div class="tweet--content">
                        <div class="content--profile">
                            <img :src="tweet.user.profile_image_url_https" alt="profile_image">
                        </div>
                        <div class="content--text">
                            <p>@{{tweet.text}}</p>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
@endsection
