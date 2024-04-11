import { Spin } from 'antd';

const Loading = () => {
  return <div style={{ textAlign: 'center', marginTop: '20%' }}>
    <Spin size="large" tip="Loading..." />
  </div>;
};

export default Loading;

