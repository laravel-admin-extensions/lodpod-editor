<?php

namespace Encore\LodpodEditor;

use Encore\Admin\Extension;
use Encore\Admin\Auth\Database\Menu;
use Encore\Admin\Admin;
use Encore\LodpodEditor\Http\Controllers\LodpodEditorTemplateController;
class LodpodEditor extends Extension
{
    public $name = 'lodpod-editor';

    public $views = __DIR__.'/../resources/views';

    public $assets = __DIR__.'/../resources/assets';

    public $menu = [
    	'title' => '打印模板',
        'path'  => 'lodpodeditortemplates',
        'icon'  => 'fa-print',
    ];

    /**
     * Bootstrap this package.
     *
     * @return void
     */
    public static function boot()
    {
        static::registerRoutes();
        Admin::extend('lodpod-editor', __CLASS__);
        return true;
    }
    /**
     * Register routes for laravel-admin.
     *
     * @return void
     */
    public static function registerRoutes()
    {
        parent::routes(function ($router) {
            /* @var \Illuminate\Routing\Router $router */
            $router->resource('lodpodeditortemplates', LodpodEditorTemplateController::class);
            $router->get('lodpodeditortemplates/{id}/custom', 'Encore\LodpodEditor\Http\Controllers\LodpodEditorTemplateController@custom');
            $router->put('lodpodeditortemplates/{id}/savecustom', 'Encore\LodpodEditor\Http\Controllers\LodpodEditorTemplateController@saveCustom');
            $router->post('lodpodeditortemplates/upload', 'Encore\LodpodEditor\Http\Controllers\LodpodEditorTemplateController@upload');
        });
    }

    public static function import()
    {
        $lastOrder = Menu::max('order');
        $root = [
            'parent_id' => 0,
            'order'     => $lastOrder++,
            'title'     => '打印模板管理',
            'icon'      => 'fa-print',
            'uri'       => 'lodpodeditortemplates',
        ];
        $root = Menu::create($root);
        
        parent::createPermission('Admin lodpod editor templates', 'ext.lodpod-editor', 'lodpodeditortemplates/*');
    }
}