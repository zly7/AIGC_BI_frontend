
import React, {useEffect, useState} from 'react';
import {listMyChartVoByPageUsingPost} from "@/services/yubi/chartController";
import { List, message } from 'antd';
import ReactECharts from "echarts-for-react";
import {useModel} from "@umijs/max";
import Search from "antd/es/input/Search";

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current:1,
    pageSize:12
  }

  const [searchParams,setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartLists,setChartLists] = useState<API.Chart[]>();
  const initialState = useModel("@@initialState")
  const [total,setTotal] = useState<number>();
  console.log(initialState);
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
      <div>
        <Search
          placeholder="请输入搜索图表名称"
          enterButton="Search"
          size="large"
          onSearch={(value) => {
            setSearchParams({...initSearchParams,
              name:value
            })
          }}
        />
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page,pageSize) => {
          setSearchParams({
              ...searchParams,
              current:page,
              pageSize:pageSize
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total:total
        }}
        dataSource={chartLists}
        renderItem={(item) => (
          <List.Item
            key={item.name}
          >
            <List.Item.Meta
              title={<a >{item.name}</a>}
              description={ item.chartType?? "未提供图标类型"}
            />
            {item.genResult}
            {
              item.status === 'running' && <>
                <div>分析中</div>
              </>
            }
            {
              item.status === "succeed" && <>
                 <ReactECharts option={JSON.parse(item.genChart ?? '')}/>;
              </>
            }
            {
              item.status === "failed" && <>
                <div>分析失败</div>
              </>
            }


          </List.Item>
        )}
      />
      <br/>
      {"total:" + total}
    </div>
  );
};
export default MyChartPage;
