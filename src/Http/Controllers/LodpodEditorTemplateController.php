<?php

namespace Encore\LodpodEditor\Http\Controllers;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Layout\Content;
use Illuminate\Routing\Controller;
use Encore\LodpodEditor\LodpodEditorTemplate;
use Encore\Admin\Grid;
use Encore\Admin\Show;
use Encore\Admin\Form;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
class LodpodEditorTemplateController extends AdminController
{
	protected $title = 'Lodpod-editor 打印模板';

	public function custom($id,Content $content){
		$form = new Form(new LodpodEditorTemplate);

		$row = LodpodEditorTemplate::find($id)->toArray();

        $form->lodpod_editor('data', __('Data'))
        	->config($row)
        	->fields([
	        	['id'=>'sender', 'text'=>trans('admin.lodpod_editor.sender')],
	        	['id'=>'sender_mobile', 'text'=>trans('admin.lodpod_editor.sender_mobile')],
	        	['id'=>'sender_address', 'text'=>trans('admin.lodpod_editor.sender_address')],
	        	['id'=>'sender_company', 'text'=>trans('admin.lodpod_editor.sender_company')],
	        	['id'=>'sender_zip_code', 'text'=>trans('admin.lodpod_editor.sender_zip_code')],
	        ]);
		$form->setAction('/admin/lodpodeditortemplates/'.$id.'/savecustom');
		return $content
            ->title($this->title())
            ->description(trans('admin.lodpod_editor.custom'))
            ->body($form->edit($id));
	}

	public function saveCustom($id){
	}

    public function grid()
    {
        $grid = new Grid(new LodpodEditorTemplate);

        $grid->column('id', __('Id'));
        $grid->column('name', __('Name'));
        $grid->column('created_at', __('Created at'));
        $grid->column('updated_at', __('Updated at'));
        return $grid;
    }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(LodpodEditorTemplate::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('name', __('Name'));
        $show->field('data', __('Data'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

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
        	->config([
        		'widthField'     =>'width',
        		'heightField'    =>'height',
        		'backgroundField'=>'background'
        	])
        	->fields([
	        	['id'=>'sender', 'text'=>trans('admin.lodpod_editor.sender')],
	        	['id'=>'sender_mobile', 'text'=>trans('admin.lodpod_editor.sender_mobile')],
	        	['id'=>'sender_address', 'text'=>trans('admin.lodpod_editor.sender_address')],
	        	['id'=>'sender_company', 'text'=>trans('admin.lodpod_editor.sender_company')],
	        	['id'=>'sender_zip_code', 'text'=>trans('admin.lodpod_editor.sender_zip_code')],
	        ]);
        return $form;
    }

    public function upload(Request $request){
    	$file = $request->file('file');
   
      	$bool= Storage::disk('admin')->put($file->getClientOriginalName(),file_get_contents($file->getRealPath()));

      	if($bool){
      		return Storage::disk('admin')->url($file->getClientOriginalName());
      	}else{
      		return false;
      	}
    }
}