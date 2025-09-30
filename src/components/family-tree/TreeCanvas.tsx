import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NodeComponent } from './NodeComponent';
import { useFamilyTreeStore } from '@/store';
import type { FamilyNode, LayoutMode, ViewMode } from '@/types';

interface TreeCanvasProps {
  data: FamilyNode[];
  width: number;
  height: number;
  layoutMode: LayoutMode;
  viewMode: ViewMode;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  data,
  width,
  height,
  layoutMode,
  viewMode
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { selectedNode, setSelectedNode } = useFamilyTreeStore();

  useEffect(() => {
    if (!svgRef.current || !data.length || !width || !height) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // 创建根数据结构
    const rootData = buildTreeData(data);
    if (!rootData) return;

    // 创建树布局
    const treeLayout = d3.tree<FamilyNode>()
      .size([width - 100, height - 100]);

    // 应用布局
    const root = d3.hierarchy(rootData);
    treeLayout(root);

    // 创建主容器组
    const g = svg.append('g')
      .attr('transform', 'translate(50, 50)');

    // 绘制连线
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical<any, any>()
        .x(d => d.x)
        .y(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#CC0000')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // 绘制节点
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.data);
      });

    // 节点背景圆圈
    nodes.append('circle')
      .attr('r', viewMode === 'simple' ? 20 : 30)
      .attr('fill', d => d.data.gender === 'male' ? '#1890ff' : '#eb2f96')
      .attr('stroke', d => selectedNode?.id === d.data.id ? '#FFD700' : '#fff')
      .attr('stroke-width', d => selectedNode?.id === d.data.id ? 3 : 2);

    // 节点文本
    nodes.append('text')
      .attr('dy', '.31em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', viewMode === 'simple' ? '12px' : '14px')
      .attr('font-weight', 'bold')
      .text(d => d.data.name.length > 3 ? d.data.name.substring(0, 3) + '...' : d.data.name);

    // 添加详细信息（详细模式）
    if (viewMode === 'detailed') {
      nodes.append('text')
        .attr('dy', '2.5em')
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .attr('font-size', '10px')
        .text(d => d.data.generationName ? `${d.data.generationName}字辈` : '');
    }

  }, [data, width, height, layoutMode, viewMode, selectedNode, setSelectedNode]);

  // 构建树形数据结构
  const buildTreeData = (members: FamilyNode[]): FamilyNode | null => {
    if (!members.length) return null;

    // 找到根节点（没有父母的最高辈分成员）
    const rootCandidates = members
      .filter(member => !member.parents || member.parents.length === 0)
      .sort((a, b) => a.generation - b.generation);

    if (!rootCandidates.length) return members[0];

    const root = rootCandidates[0];

    // 递归构建子节点
    const buildChildren = (parentId: string): FamilyNode[] => {
      return members
        .filter(member => member.parents && member.parents.includes(parentId))
        .map(child => ({
          ...child,
          children: buildChildren(child.id)
        }));
    };

    return {
      ...root,
      children: buildChildren(root.id)
    };
  };

  return (
    <div className="w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};