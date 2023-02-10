import React, {
  Component
} from "react";
import { observer } from "mobx-react";

function reducer(state, action) {
  switch (action.type) {
    case "setLedData":
      return { ...state, ledData: action.value};
    default:
      throw new Error();
  }
}

function tableConfig(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fileList, setFileList] = useState([]);
  const [fileListVideo, setFileListVideo] = useState([]);

  const handleUpload = () =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("file", file);
        formData.append("busType", "led");
      });
      const params = {
        url: "test",
        method: "post",
        data: formData,
        successFn(data) {
          resolve(data.data);
        },
      };
      tbstore.doUploadFiles(params);
    });

  const handleUploadVideo = () =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      fileListVideo.forEach((file) => {
        formData.append("file", file);
        formData.append("busType", "led");
      });
      const params = {
        url: "test",
        method: "post",
        data: formData,
        successFn(data) {
          resolve(data.data);
        },
      };
      tbstore.doUploadFiles(params);
    });
  const sendMessage = async () => {
    let tempFileUrl = "";
    if (selectVal === "1") {
      tempFileUrl = await handleUpload();
    } else if (selectVal === "2") {
      tempFileUrl = await handleUploadVideo();
    }
    const param = {
      loadingFlag: false,
      url: "test",
      method: "POST",
      data: {
     
      },
      successFn() {
        message.success("上传成功！");
      
      },
    };
    tbstore.handleNormal(param);
  };


  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }

    return isJpgOrPng && isLt2M;
  };

  const handleChangeUpload = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      // return;
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        选择
      </div>
    </div>
  );

  const props1 = {
    name: "file",
    //action: "testUrl",
    accept: "video/*",
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileListVideo(newFileList);
    },
    beforeUpload: (file) => {
      // const fileName = file.name;
      // const suffix = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length);
      // if (suffix !== 'txt') {
      //   message.error('文件类型只能是txt文本文档！');
      //   return false;
      // }
      // if (fileList.length > 0) return false;
      // setFileList([...fileList, file]);
      // return false;

      setFileListVideo([file]);
      return false;
    },
    fileList: fileListVideo,
  };
  const handleOnRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };
  const handleBeforeUpload = (file) => {
    // const fileName = file.name;
    // const suffix = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length);
    // if (suffix !== 'txt') {
    //   message.error('文件类型只能是txt文本文档！');
    //   return false;
    // }
    if (fileList.length > 0) return false;
    // setFileList([...fileList, file]);
    setFileList([file]);
    return false;
  };
  function hancleCancel() {
    window.parent && window.parent.postMessage({ type: "exit" }, "*");
  }
  return (

     
          <div className="right">
            <Select
              defaultValue={selectVal}
              className="selectMg"
              style={{
                width: "100%",
              }}
              // open
              dropdownStyle={{
                color: "#fff",
                background: "#fff",
              }}
              onChange={handleChangeSelect}
            >
              <Option value="-1">发布类型</Option>
              <Option value="0">文字</Option>
              <Option value="1">图片</Option>
              <Option value="2">视频</Option>
            </Select>
            {selectVal === "0" ? (
              <TextArea
                style={{
                  height: 208,
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  padding: "10px",
                }}
                onChange={onChangeTxt}
              />
            ) : selectVal === "1" ? (
              <div>
                <div style={{ margin: "10px 0" }}>上传图片</div>
                <Upload
                  // multiple={false}
                  accept="image/*"
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  // showUploadList={false}
                  // fileList={fileList}
                  maxCount={1}
                  beforeUpload={handleBeforeUpload}
                  onRemove={handleOnRemove}
                  action="testUrl"
                  onChange={handleChangeUpload}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}

                  {/* <Button icon={<UploadOutlined />}>Select File</Button> */}
                </Upload>
                {/* <div onClick={handleUpload} style={{ color: '#fff' }}>上传</div> */}
              </div>
            ) : selectVal === "2" ? (
              <div>
                <div style={{ margin: "10px 0" }}>上传视频</div>
                <Upload
                  // multiple={false}
                  // name="avatar"
                  // listType="picture-card"
                  // className="avatar-uploader"
                  // // showUploadList={false}
                  //
                  // beforeUpload={handleBeforeUpload}
                  // onRemove={handleOnRemove}
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // onChange={handleChangeUpload}
                  maxCount={1}
                  {...props1}
                >
                  <Button icon={<UploadOutlined />}>选择视频</Button>
                </Upload>
                {/* <div onClick={handleUploadVideo} style={{ color: '#fff' }}>上传</div> */}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="btnWrap">
          <div
            className="cancelBtn"
            onClick={sendMessage}
            style={{ marginRight: "80px" }}
          >
            发送
          </div>
          <div className="cancelBtn" onClick={hancleCancel}>
            取消
          </div>
        </div>
    
  );
}

export default tableConfig;
