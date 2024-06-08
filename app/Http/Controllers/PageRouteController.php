<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageRouteController extends Controller
{
    //
    public function dashboard(): Response
    {
        return Inertia::render('Dashboard');
    }

    public function phones() : Response
    {
        return Inertia::render('Phones');
    }
}
