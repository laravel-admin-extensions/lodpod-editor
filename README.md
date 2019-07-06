Lodpod-Editor
======

 It's a laravel-admin extension, use for lodpod print templates editing.

## Installation

```
$ composer require laravel-admin-ext/lodpod-editor

$ php artisan admin:import lodpod-editor
```
## Usage

```
/**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new LodpodEditorTemplate);
        $form->text('name', __('Name'));
        $form->lodpod_editor('data', __('Data'))
        	->config([ // background width and height setting
        		'widthField'     =>'width',
        		'heightField'    =>'height',
        		'backgroundField'=>'background'
        	])
        	->fields([ // left items
	        	[
				'id'=>'sender', 
				'text'=>trans('admin.lodpod_editor.sender')
				],
	        	[
				'id'=>'sender_mobile',
				'text'=>trans('admin.lodpod_editor.sender_mobile')
				],
	        	['id'=>'sender_address',
				'text'=>trans('admin.lodpod_editor.sender_address')
				],
	        	['id'=>'sender_company',
				'text'=>trans('admin.lodpod_editor.sender_company')
				],
	        	['id'=>'sender_zip_code',
				'text'=>trans('admin.lodpod_editor.sender_zip_code')
				],
	        ]);
        return $form;
    }
```

## Demo
![demo](https://github.com/williamtse/lodpod-editor/blob/master/resources/assets/demo.PNG?raw=true "demo")

