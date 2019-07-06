<?php

namespace Encore\LodpodEditor;

use Illuminate\Support\ServiceProvider;
use Encore\Admin\Form;
use Encore\Admin\Admin;
class LodpodEditorServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function boot(LodpodEditor $extension)
    {
        if (! LodpodEditor::boot()) {
            return ;
        }
        $views = $extension->views();

        if ($views) {
            $this->loadViewsFrom($views, 'laravel-admin-lodpod-editor');
        }

        if ($this->app->runningInConsole() && $assets = $extension->assets()) {
            $this->publishes(
                [$assets => public_path('vendor/laravel-admin-ext/lodpod-editor')],
                'lodpod-editor'
            );
        }

        Admin::booting(function () {
            Form::extend('lodpod_editor', Editor::class);
        });
    }
}