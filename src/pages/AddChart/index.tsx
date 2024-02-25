import {
  UploadOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { message, Form, Upload, Button, Select} from 'antd';
import React, {useState} from 'react';
import {genChartByAiUsingPost} from "@/services/yubi/chartController";
import TextArea from "antd/es/input/TextArea";
const AddChart: React.FC = () => {
  const [option,setOption] = useState<any>();
  const [chartResponseAllInformation,setChartResponseAllInformation] = useState<API.BiResponse>();
  const [submitting,setSubmitting] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    if(submitting){
      return;
    }
    setSubmitting(true);
    console.log('用户上传的是: ', values);
    const params = {
      ...values,
      file_obj:undefined
    }
    try{
      const res = await genChartByAiUsingPost(params,{},values.file_obj.file.originFileObj);
      if(!res?.data){
        message.error('分析失败');
      }else{
        const chartParsed = JSON.parse(res.data.genChart ?? ''); //这里主要为了防止AI生成的没办法被JSON解析
        if(chartParsed){
          setChartResponseAllInformation(res.data);
          setOption(chartParsed);
        }else{
          throw new Error('AI生成的不符合JSON解析规范，解析失败')
        }
        message.success('分析成功');
      }
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
      <div>
        {chartResponseAllInformation?.genResult}
      </div>
      <div>
        {option && <ReactECharts option={option} />}
      </div>
    </div>
  );
};
export default AddChart;
