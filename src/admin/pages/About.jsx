import React, { useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AboutAdmin = () => {
  // Form state
  const [formData, setFormData] = useState({
    aboutUsTitle: '',
    aboutUsSubTitle: '',
    aboutUsHeader: '',
    aboutUsDescription: '',
    aboutUsPhilosophyTitle: '',
    aboutUsPhilosophyDescription: '',
    aboutUsImage: null
  })
  const [previewImage, setPreviewImage] = useState('')
  const [existingAbout, setExistingAbout] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch existing about data on component mount
  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}about/getAll`
      )
      if (response.data.data && response.data.data.length > 0) {
        const aboutData = response.data.data[0]
        setExistingAbout(aboutData)
        setFormData({
          aboutUsTitle: aboutData.aboutUsTitle || '',
          aboutUsSubTitle: aboutData.aboutUsSubTitle || '',
          aboutUsHeader: aboutData.aboutUsHeader || '',
          aboutUsDescription: aboutData.aboutUsDescription || '',
          aboutUsPhilosophyTitle: aboutData.aboutUsPhilosophyTitle || '',
          aboutUsPhilosophyDescription:
            aboutData.aboutUsPhilosophyDescription || '',
          aboutUsImage: null
        })
        setPreviewImage(aboutData.aboutUsImage || '')
      }
    } catch (error) {
      toast.error('Failed to fetch about data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEditorChange = (content, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: content
    })
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        aboutUsImage: file
      })
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key])
        }
      }

      let response
      if (existingAbout) {
        response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}about/update/${existingAbout._id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        toast.success('About content updated successfully')
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}about/post`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        toast.success('About content created successfully')
      }

      fetchAboutData() // Refresh data after submission
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save about content'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingAbout) return

    if (window.confirm('Are you sure you want to delete this about content?')) {
      try {
        setIsLoading(true)
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}about/delete/${existingAbout._id}`
        )
        toast.success('About content deleted successfully')
        setExistingAbout(null)
        setFormData({
          aboutUsTitle: '',
          aboutUsSubTitle: '',
          aboutUsHeader: '',
          aboutUsDescription: '',
          aboutUsPhilosophyTitle: '',
          aboutUsPhilosophyDescription: '',
          aboutUsImage: null
        })
        setPreviewImage('')
      } catch (error) {
        toast.error('Failed to delete about content')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>About Us Content Management</h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Image Upload */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            About Us Image
          </label>
          <div className='flex items-center space-x-4'>
            {previewImage && (
              <div className='w-32 h-32 border rounded-md overflow-hidden'>
                <img
                  src={`${import.meta.env.VITE_SERVER_URL.replace( '/api/', '')}/uploads/${previewImage.replace(/\\/g, '/')}`}
                  alt='Preview'
                  className='w-full h-full object-cover'
                  onError={e => {
                    e.target.onerror = null
                    e.target.src = '/placeholder.jpg'
                  }}
                />
              </div>
            )}
            <input
              type='file'
              onChange={handleImageChange}
              accept='image/*'
              className='block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100'
            />
          </div>
        </div>

        {/* Title Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Title
            </label>
            <input
              type='text'
              name='aboutUsTitle'
              value={formData.aboutUsTitle}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Subtitle
            </label>
            <textarea
              type='text'
              name='aboutUsSubTitle'
              value={formData.aboutUsSubTitle}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        {/* Header */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Header
          </label>
          <input
            type='text'
            name='aboutUsHeader'
            value={formData.aboutUsHeader}
            onChange={handleChange}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        {/* Main Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Main Description
          </label>
          <Editor
            apiKey={import.meta.env.VITE_EDITOR_API_KEY}
            value={formData.aboutUsDescription}
            onEditorChange={content =>
              handleEditorChange(content, 'aboutUsDescription')
            }
            init={{
              height: 300,
              menubar: false,
              plugins:
                'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>

        {/* Philosophy Section */}
        <div className='space-y-4'>
          <h2 className='text-lg font-medium'>Philosophy Section</h2>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Philosophy Title
            </label>
            <input
              type='text'
              name='aboutUsPhilosophyTitle'
              value={formData.aboutUsPhilosophyTitle}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Philosophy Description
            </label>
            <Editor
              apiKey={import.meta.env.VITE_EDITOR_API_KEY}
              value={formData.aboutUsPhilosophyDescription}
              onEditorChange={content =>
                handleEditorChange(content, 'aboutUsPhilosophyDescription')
              }
              init={{
                height: 200,
                menubar: false,
                plugins:
                  'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex justify-end space-x-4 pt-4'>
          {existingAbout && (
            <button
              type='button'
              onClick={handleDelete}
              disabled={isLoading}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'
            >
              Delete
            </button>
          )}
          <button
            type='submit'
            disabled={isLoading}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
          >
            {isLoading ? 'Saving...' : existingAbout ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AboutAdmin
