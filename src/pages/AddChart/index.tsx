import {
  UploadOutlined,
} from '@ant-design/icons';

import { message, Form, Upload, Button, Select} from 'antd';
import React from 'react';
import {genChartByAiUsingPost} from "@/services/yubi/chartController";
import TextArea from "antd/es/input/TextArea";
const AddChart: React.FC = () => {
  const onFinish = async (values: any) => {
    console.log('用户上传的是: ', values);
    const params = {
      ...values,
      file_obj:undefined
    }
    try{
      const res = await genChartByAiUsingPost(params,{},values.file_obj.file.originFileObj);
      console.log(res);
      message.success('分析成功');
    }catch (e:any){
      message.error('分析失败'+e.message);
    }

  };
  return (
    <div >
      <Form
        name="validate_other"
        onFinish={onFinish}
      >
        {/*这里的name和前端发包的名称对应*/}
        <Form.Item name="goal" label="分析目标" rules={[{required:true,message:"分析需求必填"}]}>
          <TextArea placeholder="请输入你的需求，比如分析网站用户的增长情况" />
        </Form.Item>
        <Form.Item name="name" label="图表名称">
          <TextArea placeholder="" />
        </Form.Item>
        <Form.Item name="chartType" label={"生成图表类型"} rules={[{required:true,message:"生成图表类型必填"}]}>
          <Select placeholder="select your gender" options={[
            {value:"折线图",label:"折线图"},
            {value:"雷达图",label:"雷达图"}
          ]}>
          </Select>
        </Form.Item>
        <Form.Item
          name="file_obj"
          label="原始文件上传"
        >
          <Upload name="file">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};
export default AddChart;
