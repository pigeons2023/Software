// 从JSON文件加载数据
let folderData;

// 加载数据并初始化界面
//fetch('../data/software-data.json')
fetch('https://pigeons2023.github.io/Software/data/software-data.json')
    .then(response => {
        if (!response.ok) throw new Error('数据文件加载失败');
        return response.json();
    })
    .then(data => {
        folderData = data;
        initFolderEvents(); // 数据加载完成后初始化文件夹事件
    })
    .catch(error => {
        console.error('数据加载错误:', error);
        showToast('软件数据加载失败，请刷新页面', 'error');
    });

// 初始化文件夹点击事件（原逻辑迁移至此）
function initFolderEvents() {
    document.querySelectorAll('.folder-card').forEach(card => {
        const folderName = card.dataset.folder;
        // 移除生成软件图标缩略图的逻辑，改为固定文件夹图标
        card.innerHTML = `
            <div class="folder-thumbnail">
                <i class="fas fa-folder-open folder-icon"></i>
            </div>
            <p>
                ${folderName === 'screen-annotate' ? '屏幕批注' :
                folderName === 'class-management' ? '班级管理' :
                folderName === 'system-software' ? '系统软件' :
                '其他软件'}
            </p>
        `;
        card.addEventListener('click', () => showFolderModal(folderName));
    });
}

// 显示文件夹内容模态框
function showFolderModal(folderName) {
    const modal = document.getElementById('folderModal');
    const softwares = folderData[folderName];
    
    // 设置模态框标题
    document.getElementById('folderModalTitle').textContent = folderName === 'screen-annotate' ? '屏幕批注' 
        : folderName === 'class-management' ? '班级管理' 
        : folderName === 'system-software' ? '系统软件' 
        : '其他软件';  // 匹配新文件夹名称
    
    const softwareGrid = modal.querySelector('.folder-modal-grid');
    softwareGrid.innerHTML = softwares.map(software => `
        <div class="software-card" data-software='${JSON.stringify(software)}'>
            <img src="${software.icon}" class="software-icon" alt="${software.name}">
            <p>${software.name}</p>
        </div>
    `).join('');

    // 绑定软件卡片点击事件
    softwareGrid.querySelectorAll('.software-card').forEach(card => {
        card.addEventListener('click', () => {
            try {
                const software = JSON.parse(card.dataset.software);
                showSoftwareModal(software);
            } catch (error) {
                showToast('解析软件信息失败，请重试');
            }
        });
    });

    modal.style.display = 'block';
}

// 关闭文件夹模态框
document.getElementById('closeFolderModal').addEventListener('click', () => {
    document.getElementById('folderModal').style.display = 'none';
});

// 点击模态框外区域关闭（补充）
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('folderModal')) {
        document.getElementById('folderModal').style.display = 'none';
    }
});

// 显示软件详情模态框
function showSoftwareModal(software) {
    console.log('尝试显示软件详情模态框，软件名称：', software.name);
    try {
        const modal = document.getElementById('softwareModal');
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = software.name;
        document.getElementById('modalDesc').textContent = software.desc;
        document.getElementById('openDoc').onclick = async () => {  // 改为async函数
            // 文档链接校验
            if (!software.doc) {
                showToast('该软件暂无文档', 'warning'); 
                return;
            }

            // 新增：检查文档是否存在
            try {
                const response = await fetch(software.doc);
                if (!response.ok) {  // 状态码非200
                    throw new Error(`文档不存在（状态码：${response.status}）`);
                }
                window.open(`doc-viewer.html?file=${encodeURIComponent(software.doc)}`);
            } catch (error) {
                console.error('文档加载失败：', error);
                showToast('文档不存在或路径错误', 'error');  // 404提示
            }
        };
    } catch (error) {
        console.error('显示软件详情失败：', error);
        showToast('加载软件详情失败，请重试'); 
    }
}

// 关闭模态框
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('softwareModal').style.display = 'none';
});

// 点击模态框外区域关闭
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('softwareModal')) {
        document.getElementById('softwareModal').style.display = 'none';
    }
});

// 新增：ESC键关闭模态框
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {  // 监听ESC键按下事件
        const folderModal = document.getElementById('folderModal');
        const softwareModal = document.getElementById('softwareModal');
        
        // 调整顺序：优先关闭上层的软件详情模态框
        if (softwareModal.style.display === 'block') {
            softwareModal.style.display = 'none';
        } else if (folderModal.style.display === 'block') {
            folderModal.style.display = 'none';
        }
    }
});
