#!/bin/bash

# 定义要修改的内容
MODIFICATION=$(cat <<EOF
### 更新内容

1. **探索回溯**
   - 在中期汇报之前，使用栈结构实现了 \`undo\`、\`redo\` 和 \`reset\` 功能。
   - 当前版本改为使用 DAG 结构，并补充了之前缺少的分支回溯功能。
   - 具体实现已更新至 \`develop\` 分支。
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
  git commit -m "Update README.md with MODIFICATION content" 2>/dev/null

  # 推送修改到远程
  git push origin $branch || {
    echo "Push failed for $branch. Retrying..."
    git pull --rebase
    git push origin $branch
  }

  # 恢复未提交的更改
  git stash pop 2>/dev/null || {
    echo "Conflict detected. Resolving automatically..."
    git checkout --theirs .
    git add .
    git commit -m "Resolve conflicts during stash pop"
  }
done

