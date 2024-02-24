import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {Helmet, history, Link, useModel} from '@umijs/max';
import {Alert, Tabs, message, Form, Upload, Button, Select} from 'antd';
import { createStyles } from 'antd-style';
import React, {useEffect, useState} from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../config/defaultSettings';
import {listChartByPageUsingPost} from "@/services/yubi/chartController";
import {getLoginUserUsingGet, userLoginUsingPost} from "@/services/yubi/userController";
import TextArea from "antd/es/input/TextArea";
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  /*
   獲取登陸信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await getLoginUserUsingGet();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({ //ant.design.pro提供的全局支持
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPost(values);
      if (res.code === 0) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }else{
        message.error(res.message)
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;
  const onFinish = (values: any) => {
    console.log('用户上传的是: ', values);
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
        <Form.Item name="chart_type" label={"生成图表类型"} rules={[{required:true,message:"生成图表类型必填"}]}>
          <Select placeholder="select your gender" options={[
            {value:"折线图",label:"折线图"},
            {value:"雷达图",label:"折线图"}
          ]}>
          </Select>
        </Form.Item>




        <Form.Item
          name="file"
          label="原始文件上传"
        >
          <Upload name="logo">
            {/*<Button icon={<UploadOutlined />}>Click to upload</Button>*/}
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
export default Login;
