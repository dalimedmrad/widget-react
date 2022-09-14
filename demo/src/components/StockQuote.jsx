import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";
import PDF from "../media/images.png";
import file from "../media/file-blank-solid-240.png";
import docs from "../media/word.png";
import imgicon from "../media/imgicon.png";
import { Document, Page, pdfjs } from "react-pdf";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import WebViewer from "@pdftron/webviewer";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loader from "./Loader/Loader";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function StockQuote(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState({});
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [updatedata, setUpdateData] = useState({});
  const [updatebtn, setupdatebtn] = useState(false);
  const [update, setUpdate] = useState(false);
  const viewerDiv = useRef();

  const handelDel = async (el) => {
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: `${el.file.fileName} will be deleted!`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, delete it!",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    await axios.delete(
      `https://nodeappscitrine.herokuapp.com/api/doc/${el._id}`
    );
    await axios
      .get("https://nodeappscitrine.herokuapp.com/api/doc")
      .then((result) => {
        setData(result.data.response);
      });

    //     Swal.fire("Deleted!", "Your file has been deleted.", "success");
    //     // window.location.reload();
    //   }
    // });
  };
  const handleShow = (el) => {
    setUpdate(true);
    setData1(el);
    setShow(true);
  };
  const handleShow1 = (el) => {
    setUpdateData(el);
    setShow1(true);
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  const handelchange = (e, editor) => {
    setupdatebtn(true);
    setUpdateData({ ...updatedata, text: editor.getData() });
  };
  const Update = async () => {
    await axios
      .put(
        `https://nodeappscitrine.herokuapp.com/api/doc/${updatedata._id}`,
        updatedata
      )
      .then((result) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${result.data.msg}`,
          showConfirmButton: false,
          timer: 1300,
        });
      });
    await axios
      .get("https://nodeappscitrine.herokuapp.com/api/doc")
      .then((result) => {
        setData(result.data.response);
      });
    setupdatebtn(false);
  };

  useEffect(() => {
    async function getData() {
      await axios
        .get("https://nodeappscitrine.herokuapp.com/api/doc")
        .then((result) => {
          setData(result.data.response);
        });
    }
    getData();
  }, []);

  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc: `${`https://nodeappscitrine.herokuapp.com/${data1?.file?.filePath?.substring(
          7
        )}`}`,
      },
      viewerDiv.current
    );
  }, [update]);
  return (
    <div className="fillData">
      {data ? (
        <>
          {data?.length != 0 ? (
            data?.map((el) => (
              <div className="fileCard">
                {el.file.fileType === "application/pdf" && (
                  <div className="fileCardtop" onClick={() => handleShow(el)}>
                    <Document
                      file={`https://nodeappscitrine.herokuapp.com/${el?.file?.filePath?.substring(
                        7
                      )}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page height="150" width="170" pageNumber={pageNumber} />
                    </Document>
                  </div>
                )}
                {el.file.fileType.includes("image") && (
                  <div className="fileCardtop" onClick={() => handleShow(el)}>
                    <img
                      alt=""
                      className="img1"
                      src={`https://nodeappscitrine.herokuapp.com/${el?.file?.filePath?.substring(
                        7
                      )}`}
                    />
                  </div>
                )}
                {el.file.fileType.includes("word") && (
                  <div className="fileCardtop" onClick={() => handleShow(el)}>
                    <img className="img1" alt="" src={docs} />
                  </div>
                )}
                {el.file.fileType === "text/plain" && (
                  <div className="fileCardtop" onClick={() => handleShow1(el)}>
                    <img className="img1" alt="" src={file} />
                  </div>
                )}
                <span
                  className="drop-file-preview__item__del"
                  onClick={() => handelDel(el)}
                >
                  <b>x</b>
                </span>

                <Modal
                  show={show}
                  fullscreen={fullscreen}
                  onHide={() => {
                    setShow(false);
                    setUpdate(false);
                  }}
                >
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body>
                    <div ref={viewerDiv} style={{ height: "100vh" }}></div>
                  </Modal.Body>
                </Modal>

                <Modal
                  show={show1}
                  fullscreen={fullscreen}
                  onHide={() => setShow1(false)}
                >
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body>
                    <div className="doccpage">
                      <div className="docctit">
                        <button
                          disabled={updatebtn ? false : true}
                          onClick={Update}
                          className="btn btn-success"
                        >
                          SAUVGARDER
                        </button>
                      </div>
                      <div className="docc">
                        <CKEditor
                          class="ck-content"
                          editor={ClassicEditor}
                          data={`${updatedata?.text}`}
                          onChange={(e, editor) => {
                            handelchange(e, editor);
                          }}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
                <div className="fileCardbottom">
                  {el.file.fileType === "application/pdf" && (
                    <img className="imgs" src={PDF} alt="" />
                  )}
                  {el.file.fileType.includes("image") && (
                    <img className="imgs" src={imgicon} alt="" />
                  )}
                  {el.file.fileType.includes("word") && (
                    <img className="imgs" src={docs} alt="" />
                  )}
                  {el.file.fileType === "text/plain" && (
                    <img className="imgs" src={file} alt="" />
                  )}
                  {el.file.fileName.length > 20 ? (
                    <a
                      target="_blank"
                      href={
                        process.env.PUBLIC_URL +
                        `https://nodeappscitrine.herokuapp.com/${el?.file?.filePath?.substring(
                          7
                        )}`
                      }
                      data-title={el?.file?.fileName}
                    >
                      {`${el?.file?.fileName?.substring(0, 20)}...`}
                    </a>
                  ) : (
                    <a
                      target="_blank"
                      href={
                        process.env.PUBLIC_URL +
                        `https://nodeappscitrine.herokuapp.com/${el?.file?.filePath?.substring(
                          7
                        )}`
                      }
                    >
                      {el.file.fileName}
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>There is no document</div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default StockQuote;
