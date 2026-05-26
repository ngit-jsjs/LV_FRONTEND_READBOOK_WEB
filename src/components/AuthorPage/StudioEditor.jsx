import React, { useState } from 'react';
import { FiMoon } from 'react-icons/fi';
import './StudioEditor.css';

function StudioEditor({ isFocusMode, setIsFocusMode }) {
  const [content, setContent] = useState(`Bầu trời đêm ấy, sao rơi như những giọt nước mắt.

Linh Vân đứng trên đỉnh tháp, gió thổi tung mái tóc bạc tím của nàng. Ánh mắt nàng hướng lên khoảng không vô tận, nơi có một vì sao sáng rực đang rơi xuống.

"Có lẽ... vận mệnh của chúng ta cũng giống như ngôi sao ấy."

Phía sau, một giọng nói trầm khàn vang lên.

Nàng quay người lại, thấy Hạ Vũ đang bước đến. Ánh trăng chiếu lên gương mặt anh, nửa sáng nửa tối, như che giấu điều gì đó trong lòng.

"Em có từng tin vào vận mệnh không?" anh hỏi.

Linh Vân im lặng một lúc, rồi khẽ lắc đầu.
"Em chỉ tin vào những gì em có thể nắm giữ."

Hạ Vũ mỉm cười, mắt anh ánh lên tia ấm áp.
"Vậy thì, hãy để em trở thành điều em có thể nắm giữ."

...`);

  return (
    <main className="studio-editor">
      

     
      {/* Editor Content Area */}
      <div className="editor-content-area">
        <div className="editor-content-wrapper">
          <input 
            type="text" 
            className="editor-title-input" 
            value="Chương 5: Ánh Sao Rơi"
            readOnly
          />
          
          <textarea 
            className="editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      {/* Editor Bottom Bar */}
      <div className="editor-bottombar">
        <div className="bottombar-right">
          <button className="btn-dark-mode">
            <FiMoon /> Chế độ: Tối <span>▼</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default StudioEditor;
