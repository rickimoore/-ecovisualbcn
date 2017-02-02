<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
use App\Http\Requests;

class MindController extends Controller
{

    public function openMind(){
        return view('mind');
    }

    public function searchTwitter($id){
        $striped_id = explode(" ",$id);
        $filtered_id = implode("%20",$striped_id);
        $stack = HandlerStack::create();
        $keys = config('services.twitter');
        $middleware = new Oauth1([
            'consumer_key' => $keys['client_id'],
            'consumer_secret' => $keys['client_secret'],
            'token' => $keys['token'],
            'token_secret' => $keys['token_secret']
        ]);

        $stack->push($middleware);

        $client = new Client(['base_uri' => 'https://api.twitter.com/1.1/', 'handler' => $stack, 'auth' => 'oauth']);

        $search = 'search/tweets.json?q=' . $filtered_id . '&count=200&result_type=recent';

        $res = $client->get($search);

        return json_decode((string) $res->getBody(), true);
    }
}
