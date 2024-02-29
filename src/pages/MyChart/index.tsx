
import React, {useEffect, useState} from 'react';
import {listMyChartVoByPageUsingPost} from "@/services/yubi/chartController";
import { List, message } from 'antd';
import ReactECharts from "echarts-for-react";

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    pageSize:12
  }

  const [searchParams,setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartLists,setChartLists] = useState<API.Chart[]>();
  const [total,setTotal] = useState<number>();
  const loadData = async () => {
    try {
      const res = await listMyChartVoByPageUsingPost(searchParams);
      setChartLists(res.data?.records);
      setTotal(res.data?.total);
    }catch (e:any){
      message.error("请求后端页面发生错误"+e.message);
    }
  }
  useEffect(()=>{
    loadData();
  },[searchParams])

  return (
    <div className={'my-chart-page'}>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={chartLists}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.name}
          >
            <List.Item.Meta
              title={<a >{item.name}</a>}
              description={ item.chartType?? "未提供图标类型"}
            />
            {item.genResult}
            {/*{(() => {*/}
            {/*  try {*/}
            {/*    const chartOptionString = JSON.stringify(item.genChart);*/}
            {/*    return <ReactECharts option={chartOptionString}/>;*/}
            {/*  } catch (error) {*/}
            {/*    console.error("Failed to stringify item.genChart:", error);*/}
            {/*    // 根据需要返回一个备选的 React 元素，或者什么都不返回（null）*/}
            {/*    return null; // 或者可以是错误提示组件*/}
            {/*  }*/}
            {/*})()}*/}
            <ReactECharts option={item.genChart}/>;
          </List.Item>
        )}
      />
      <br/>
      {"total:" + total}
    </div>
  );
};
export default MyChartPage;
