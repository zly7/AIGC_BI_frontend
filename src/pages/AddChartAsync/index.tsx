import {
  UploadOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { message, Form, Upload, Button, Select, Row, Col, Card, Spin, Divider, Radio } from 'antd';
import React, {useEffect, useState} from 'react';
import {genChartByAiAsyncUsingPost, getChartVoByIdUsingGet} from "@/services/yubi/chartController";
import TextArea from "antd/es/input/TextArea";
import EChartsReact from "echarts-for-react";
const AddChart: React.FC = () => {
  const [option,setOption] = useState<any>();
  const [chartResponseAllInformation,setChartResponseAllInformation] = useState<API.Chart>();
  const [submitting,setSubmitting] = useState<boolean>(false);
  const[currentChartId,setCurrentChartId] = useState<number>();
  const [shouldStopPolling, setShouldStopPolling] = useState<boolean>(false); // 新增状态变量
  const fetchChartInformation = async (chartId: number) => {
    // 异步函数，用于向后端请求数据
    try {
      const res = await getChartVoByIdUsingGet({ id:chartId });
      if (res && res.data) {
        setChartResponseAllInformation(res?.data);
        const chartParsed = JSON.parse(res?.data.genChart ?? '');
        if(chartParsed){
          setOption(chartParsed);
          setShouldStopPolling(true);
        }
      } else {
        message.error('获取图表信息失败');
      }
    } catch (error) {
      console.error('获取图表信息异常', error);
      message.error('获取图表信息异常');
    }
  };
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
      const res = await genChartByAiAsyncUsingPost(params,{},values.file_obj.file.originFileObj);
      if(!res?.data){
        message.error('分析失败');
      }else{
        const chartParsed = res?.data.chartId;
        if(chartParsed){
          setCurrentChartId(chartParsed);
          setShouldStopPolling(false); // 重新设置定时器
        }
      }
    }catch (e:any){
      message.error('分析请求提交失败'+e.message);
    }
    setSubmitting(false);
  };
  useEffect(() => {
    if (shouldStopPolling) {
      return;
    }
    const intervalId = setInterval(() => {
      if (currentChartId) {
        fetchChartInformation(currentChartId);
      }
    }, 3000); // 设置定时器，每秒查询一次
    return () => clearInterval(intervalId); // 组件卸载时清理定时器
  }, [currentChartId,shouldStopPolling]); // 依赖项为currentChartId，当其变化时重新设置定时器

  return (
    <div className={'add-chart'}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'智能分析'}>
            <Form name="validate_other" onFinish={onFinish}>
              {/*这里的name和前端发包的名称对应*/}
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '分析需求必填' }]}
              >
                <TextArea placeholder="请输入你的需求，比如分析网站用户的增长情况" />
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <TextArea placeholder="" />
              </Form.Item>
              <Form.Item
                name="chartType"
                label={'生成图表类型'}
                rules={[{ required: true, message: '生成图表类型必填' }]}
              >
                <Select
                  placeholder="select your gender"
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '雷达图', label: '雷达图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '堆叠图', label: '堆叠图' },
                    { value: '饼图', label: '饼图' },
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item label="模型选择" name="modelName">
                <Radio.Group>
                  <Radio.Button value={"yucongming"}>鱼聪明</Radio.Button>
                  <Radio.Button value={"GPT-3.5"}>GPT-3.5</Radio.Button>
                  <Radio.Button value="GPT-4">GPT-4</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="file_obj" label="原始文件上传">
                <Upload name="file">
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={'异步分析结果'}>
            <Spin spinning={submitting}></Spin>
            <div>
              {chartResponseAllInformation?.status === 'running' &&
                <div>
                  <Divider>分析中</Divider>
                  <p>分析中，请耐心等待</p>
                </div>
              }
              {chartResponseAllInformation?.status === 'wait' &&
                <div>
                  <Divider>等待中</Divider>
                  <p>等待中，请耐心等待</p>
                </div>
              }
              {
                chartResponseAllInformation?.status === 'succeed' &&
                <div>
                  <Divider>分析成功</Divider>
                  <p>{chartResponseAllInformation?.genResult}</p>
                  <EChartsReact option={option} />
                </div>
              }
              {
                chartResponseAllInformation?.status === 'failed' &&
                <div>
                  <Divider>分析失败</Divider>
                  <p>{chartResponseAllInformation?.execMessage}</p>
                </div>
              }
            </div>
          </Card>

        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
