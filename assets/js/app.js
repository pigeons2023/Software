// 数据
const folderData = {
    "screen-annotate": [ // 屏幕批注文件夹
        { name: 'Ink Canvas', icon: 'images/ic.png', desc: '多功能屏幕批注程序', doc: 'docs/ic.md' },
        { name: 'Ink Canvas Artistry', icon: 'images/ica.png', desc: '多功能屏幕批注程序', doc: 'docs/ica.md' },
        { name: 'Ink Canvas Basic', icon: 'images/icb.png', desc: '多功能屏幕批注程序', doc: 'docs/icb.md' },
        { name: 'Ink Canvas for Class', icon: 'images/icc.png', desc: '多功能屏幕批注程序', doc: 'docs/icc.md' }
    ],
    "class-management": [ // 班级管理文件夹
        { name: '班级管家', icon: 'images/CA.png', desc: '班级管理工具', doc: 'docs/CA.md' },
        { name: '考试看板', icon: 'images/exam.png', desc: '考试看板工具', doc: 'docs/exam.md' }
    ],
    "system-software": [ // 系统软件文件夹
        { name: 'Office Tool Plus', icon: 'images/OTP.png', desc: 'Office安装工具', doc: 'docs/OTP.md' },

    ],
    "other-software": [ // 其他软件文件夹
    ]
};

// 初始化文件夹点击事件
document.querySelectorAll('.folder-card').forEach(card => {
    const folderName = card.dataset.folder;
    // 移除生成软件图标缩略图的逻辑，改为固定文件夹图标
    card.innerHTML = `
        <div class="folder-thumbnail">
            <i class="fas fa-folder-open folder-icon"></i>  <!-- 使用Font Awesome文件夹图标 -->
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