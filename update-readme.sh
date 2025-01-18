#!/bin/bash

# ����Ҫ�޸ĵ�����
MODIFICATION=$(cat <<EOF
### ��������

1. **̽������**
   - �����ڻ㱨֮ǰ��ʹ��ջ�ṹʵ���� \`undo\`��\`redo\` �� \`reset\` ���ܡ�
   - ��ǰ�汾��Ϊʹ�� DAG �ṹ����������֮ǰȱ�ٵķ�֧���ݹ��ܡ�
   - ����ʵ���Ѹ����� \`develop\` ��֧��
EOF
)

# ��ȡ����Զ�̷�֧
branches=$(git branch -r | grep -v '\->' | sed 's/origin\///')

for branch in $branches; do
  echo "Processing branch: $branch"

  # ����δ�ύ�ĸ���
  git stash -u

  # �����֧
  git checkout -b $branch origin/$branch 2>/dev/null || git checkout $branch

  # ��� README.md �ļ���д��������
  echo "$MODIFICATION" > README.md

  # �ύ����
  git add README.md
  git commit -m "Update README.md with MODIFICATION content" 2>/dev/null

  # �����޸ĵ�Զ��
  git push origin $branch || {
    echo "Push failed for $branch. Retrying..."
    git pull --rebase
    git push origin $branch
  }

  # �ָ�δ�ύ�ĸ���
  git stash pop 2>/dev/null || {
    echo "Conflict detected. Resolving automatically..."
    git checkout --theirs .
    git add .
    git commit -m "Resolve conflicts during stash pop"
  }
done

