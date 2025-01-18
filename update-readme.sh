#!/bin/bash

# ����Ҫ�޸ĵ�����
MODIFICATION=$(cat <<EOF
### ��������

1. **̽������**
   - �����ڻ㱨֮ǰ��ʹ��ջ�ṹʵ���� \`undo\`��\`redo\` �� \`reset\` ���ܡ���ǰ�Ļ��ݹ���ֻ�ܻص����ʼδ�������ֵ�״̬��ȱ�ٷ�֧��
   - ��ǰ�汾��Ϊʹ�� DAG �ṹ����������֮ǰȱ�ٵķ�֧���ݹ��ܡ�
   - ����ʵ���Ѹ����� \`develop\` ��֧��

2. **��һ����ʾ**

3. **��Ŀ����**
   - ֧������ URL ��ʽ��
     1. ������ѡֵ�������� 0~9 �����֡�
     2. ������ѡֵ״̬��λͼ������ʽ��
   - URL �ĵ���֧������λ�ã�
     1. �� \`welcome\` ����ֱ�ӵ��� URL��
     2. �ڽ������Ͻ�ѡ�����׳̶�ʱ��ͨ�� \`Enter Code\` ���ֵ��� URL��

4. **��Դ���ɣ�����ʵ��**
   - ���԰����ѶȻ���Ϊ�򵥲��ԡ��м����Ժ͸߼����ԣ�
     - **�򵥲���**��\`Last_remaining\`��\`hidden_single\`
     - **�м�����**��\`naked_pairs\`
     - **�߼�����**��\`X-Wing\`��\`Y-Wing\`
   - **Note**: ����Դ������������У�����������Ʋ��Թ������ļܹ�Ϊ����������������ʽ�������С��С��Ź�����������������ǰ�� \`debug\` �׶Σ���δ��ȫ������⡣
EOF
)

# �����������
echo "Checking network connection..."
ping -c 3 github.com >/dev/null 2>&1 || {
  echo "Network error: Unable to reach GitHub."
  exit 1
}

# ��ȡ����Զ�̷�֧
branches=$(git branch -r | grep -v '\->' | sed 's/origin\///')

for branch in $branches; do
  echo "Processing branch: $branch"

  # ����δ�ύ�ĸ���
  git stash -u || {
    echo "Error: Unable to stash changes."
    exit 1
  }

  # �����֧
  git checkout -b $branch origin/$branch 2>/dev/null || git checkout $branch || {
    echo "Error: Unable to switch to branch $branch."
    exit 1
  }

  # ȷ���ļ���պ�д����������
  printf "%s\n" "$MODIFICATION" > README.md

  # �ύ����
  git add README.md
  git commit -m "Update README.md" || {
    echo "Error: Commit failed on branch $branch."
    exit 1
  }

  # �����޸ĵ�Զ��
  git push origin $branch || {
    echo "Push failed for $branch. Retrying..."
    git pull --rebase || {
      echo "Error: Pull failed for $branch."
      exit 1
    }
    git push origin $branch || {
      echo "Error: Push failed again for $branch."
      exit 1
    }
  }

  # �ָ�δ�ύ�ĸ���
  git stash pop 2>/dev/null || {
    echo "Conflict detected. Resolving automatically..."
    git checkout --theirs .
    git add .
    git commit -m "Resolve conflicts during stash pop" || {
      echo "Error: Unable to resolve conflicts."
      exit 1
    }
  }
done

echo "Script execution completed successfully."
