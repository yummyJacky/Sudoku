#!/bin/bash

# 定义要修改的内容
MODIFICATION=$(cat <<EOF
### 更新内容

1. **探索回溯**
   - 在中期汇报之前，使用栈结构实现了 \`undo\`、\`redo\` 和 \`reset\` 功能。此前的回溯功能只能回到最初始未填入数字的状态，缺少分支。
   - 当前版本改为使用 DAG 结构，并补充了之前缺少的分支回溯功能。
   - 具体实现已更新至 \`develop\` 分支。

2. **下一步提示**

3. **题目导入**
   - 支持两种 URL 格式：
     1. 不含候选值，仅包含 0~9 的数字。
     2. 包含候选值状态的位图编码形式。
   - URL 的导入支持两种位置：
     1. 在 \`welcome\` 界面直接导入 URL。
     2. 在界面左上角选择难易程度时，通过 \`Enter Code\` 部分导入 URL。

4. **资源集成，策略实现**
   - 策略按照难度划分为简单策略、中级策略和高级策略：
     - **简单策略**：\`Last_remaining\`，\`hidden_single\`
     - **中级策略**：\`naked_pairs\`
     - **高级策略**：\`X-Wing\`，\`Y-Wing\`
   - **Note**: 在资源调度器的设计中，尝试重新设计策略管理器的架构为类似于推理链的形式，包含行、列、九宫格三个迭代。但当前在 \`debug\` 阶段，尚未完全解决问题。
EOF
)

# 获取所有远程分支
branches=$(git branch -r | grep -v '\->' | sed 's/origin\///')

for branch in $branches; do
  echo "Processing branch: $branch"

  # 保存未提交的更改
  git stash -u

  # 检出分支
  git checkout -b $branch origin/$branch 2>/dev/null || git checkout $branch

  # 清空 README.md 文件并写入新内容
  echo "$MODIFICATION" > README.md

  # 提交更改
  git add README.md
  git commit -m "Update README.md" 2>/dev/null

  # 推送修改到远程
  git push origin $branch

  # 恢复未提交的更改
  git stash pop 2>/dev/null
done
