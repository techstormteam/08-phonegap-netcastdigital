############################################################################
# msx264.cmake
# Copyright (C) 2014  Belledonne Communications, Grenoble France
#
############################################################################
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#
############################################################################

set(EP_msx264_GIT_REPOSITORY "git://git.linphone.org/msx264.git")
if(${LINPHONE_BUILDER_LATEST})
	set(EP_msx264_GIT_TAG "master")
else()
	set(EP_msx264_GIT_TAG "6532dd845c59631a9149e9146ba5cf9426db906b")
endif()
set(EP_msx264_BUILD_METHOD "autotools")
set(EP_msx264_USE_AUTOGEN "yes")
set(EP_msx264_CROSS_COMPILATION_OPTIONS
	"--prefix=${CMAKE_INSTALL_PREFIX}"
	"--host=${LINPHONE_BUILDER_HOST}"
)
set(EP_msx264_LINKING_TYPE "--disable-static" "--enable-shared")
set(EP_msx264_DEPENDENCIES EP_ms2 EP_x264)
