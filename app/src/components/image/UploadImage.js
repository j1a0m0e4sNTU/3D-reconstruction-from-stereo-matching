import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import toastr from 'toastr'
import { uploadImage } from '../../actions/imageActions'
import Spinner from '../common/Spinner'

class UploadImage extends Component {
  state = {
    title: '',
    description: '',
    tags: '',
    buffer: null,
    fileLeft: null,
    fileRight: null,

    
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  captureFile = (tag) => (event) => {
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      if(tag==="l"){
        this.setState({
          buffer: Buffer(reader.result),
          fileLeft: URL.createObjectURL(file),
        })
      }
      else{
        this.setState({
          buffer: Buffer(reader.result),
          fileRight: URL.createObjectURL(file),
        })
      }

    }
  }

  handleUploadImage = async (event) => {
    event.preventDefault()
    const { title, description, tags, buffer } = this.state
    // console.log(title, description, buffer)
    try {
      await this.props.uploadImage(buffer, title, description, tags)
      toastr.success(
        '上傳作品成功至星際檔案系統，等待Metamask確認將IPFS hash存至以太鏈'
      )
    } catch (error) {
      toastr.error(error)
    }

    // return to image list
    this.props.history.push('/user')
  }

  render() {
    return (
      <div className="container">
        <fieldset disabled={this.props.loading}>
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center mt-4">上傳圖片</h1>
                {this.props.loading ? (
                  <Spinner />
                ) : (
                  <p className="lead text-center">
                    上傳你的Stereo圖至星際檔案系統 (IPFS)，我們將幫你製作3D模型
                  </p>
                )}
              <form
                className="needs-validation"
                onSubmit={this.handleUploadImage}
              >
                <div className="form-group">
                  <label htmlFor="title">標題 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="標題..."
                    value={this.state.title}
                    onChange={this.handleChange}
                    required
                  />
                  <div className="invalid-feedback">標題必填</div>
                </div>
                <div className="form-group">
                  <label htmlFor="description">關於本作品</label>
                  <textarea
                    className="form-control"
                    id="description"
                    placeholder="一些描述..."
                    rows="3"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="tags">標籤 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    placeholder="標籤..."
                    value={this.state.tags}
                    onChange={this.handleChange}
                    required
                  />
                  <small id="tagsHelpBlock" className="form-text text-muted">
                    例如：大自然、球賽、都市、台大網多實驗...
                  </small>
                  <div className="invalid-feedback">標籤必填</div>
                </div> */}
                <div className="form-group">
                  <label htmlFor="file">左圖 *</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="fileL"
                    onChange={this.captureFile("l")}
                    required
                  />
                  <div className="invalid-feedback">必須上傳左圖</div>
                </div>
                <div className="form-group">
                  <label htmlFor="file">右圖 *</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="fileR"
                    onChange={this.captureFile("r")}
                    required
                  />
                  <div className="invalid-feedback">必須上傳右圖</div>
                </div>
                <small className="d-block pb-3">* 表示必填</small>
                <div className="mb-3">
                  <Link to="/" className="btn btn-secondary mr-2">
                    取消
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    發布
                  </button>
                </div>
              </form>
              {this.state.fileLeft && (
                <div className="text-center mt-3 mb-3">
                  <h2>預覽左圖</h2>
                  <img
                    src={this.state.fileLeft}
                    className="img-thumbnail"
                    alt="Preview"
                  />
                </div>
              )}
                {this.state.fileRight && (
                <div className="text-center mt-3 mb-3">
                  <h2>預覽右圖</h2>
                  <img
                    src={this.state.fileRight}
                    className="img-thumbnail"
                    alt="Preview"
                  />
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.image.loading,
})

export default connect(
  mapStateToProps,
  { uploadImage }
)(UploadImage)
