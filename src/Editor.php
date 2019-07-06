<?php
namespace Encore\LodpodEditor;
use Encore\Admin\Form\Field;
class Editor extends Field
{
    protected $view = 'laravel-admin-lodpod-editor::editor';
    protected static $css = [
        'vendor/laravel-admin-ext/lodpod-editor/lodpod-editor.css',
    ];
    protected static $js = [
        'vendor/laravel-admin-ext/lodpod-editor/lodpod-editor.min.js',
    ];
    protected $config = [];
    protected $fields = [];

    public function config($config){
        $this->config = $config;
        return $this;
    }

    public function fields($fields){
        $this->fields = $fields;
        return $this;
    }

    public function render()
    {
        $json = old($this->column, $this->value());
        if (empty($json)) {
            $json = '{}';
        }
        if (!is_string($json)) {
            $json = json_encode($json);
        } else {
            $json = json_encode(json_decode($json,true)); 
        }
        $this->value = $json;
        $options = json_encode($this->config);
        $fields = json_encode($this->fields);
        $this->script = <<<EOT
// create the editor
var container = document.getElementById("{$this->id}");
var options = {$options};
var fields = {$fields};
console.log(options);
var editor = new LodpodEditor(container, options, fields);
// set json
var json = $json;
editor.set(json);
editor.render();
// get json
$('button[type="submit"]').click(function() {
var json = editor.get()
$('input[id={$this->id}_input]').val(JSON.stringify(json))
})
EOT;
        return parent::render();
    }
}