import React, { useEffect, useRef, useState } from 'react';
import { Card, Space, Button, Select, Tooltip } from 'antd';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  ReloadOutlined,
  FullscreenOutlined 
} from '@ant-design/icons';
import { TreeCanvas } from './TreeCanvas';
import { useFamilyTreeStore, useUIStore } from '@/store';
import type { LayoutMode, ViewMode } from '@/types';

const { Option } = Select;

export const FamilyTreeView: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const { 
    treeData, 
    selectedNode, 
    layoutMode, 
    viewMode,
    setLayoutMode,
    setViewMode,
    loadTree 
  } = useFamilyTreeStore();
  
  const { addNotification } = useUIStore();

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  const handleZoomReset = () => setZoomLevel(1);

  const handleRefresh = () => {
    loadTree();
    addNotification({
      type: 'success',
      title: '刷新成功',
      message: '族谱数据已刷新',
      read: false
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <Space>
            <Select value={layoutMode} onChange={setLayoutMode} style={{ width: 120 }}>
              <Option value="tree">树形布局</Option>
              <Option value="list">列表布局</Option>
            </Select>
            <Select value={viewMode} onChange={setViewMode} style={{ width: 120 }}>
              <Option value="simple">简洁</Option>
              <Option value="detailed">详细</Option>
            </Select>
          </Space>

          <Space>
            <Tooltip title="放大">
              <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} disabled={zoomLevel >= 3} />
            </Tooltip>
            <Tooltip title="缩小">
              <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} disabled={zoomLevel <= 0.3} />
            </Tooltip>
            <Tooltip title="重置">
              <Button icon={<ReloadOutlined />} onClick={handleZoomReset} />
            </Tooltip>
            <Tooltip title="刷新">
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            </Tooltip>
          </Space>
        </div>
      </div>

      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        {treeData.length > 0 ? (
          <TreeCanvas
            data={treeData}
            width={canvasSize.width}
            height={canvasSize.height}
            layoutMode={layoutMode}
            viewMode={viewMode}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="text-center">
              <p className="text-lg mb-2">暂无族谱数据</p>
              <p className="text-sm">请先添加家族成员信息</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};